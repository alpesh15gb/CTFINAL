import crypto from "crypto"
import Razorpay from "razorpay"
import { AbstractPaymentProvider, MedusaError } from "@medusajs/framework/utils"
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import type { RazorpayProviderOptions } from "./types"

class RazorpayPaymentProviderService extends AbstractPaymentProvider<RazorpayProviderOptions> {
  static identifier = "razorpay"

  protected client_: Razorpay
  protected options_: RazorpayProviderOptions

  constructor(container: Record<string, unknown>, options: RazorpayProviderOptions) {
    super(container, options)
    this.options_ = options
    this.client_ = new Razorpay({
      key_id: options.key_id,
      key_secret: options.key_secret,
    })
  }

  private toPaise(amount: unknown): number {
    return Math.round(Number(amount) * 100)
  }

  private verifyCheckoutSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const expected = crypto
      .createHmac("sha256", this.options_.key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex")
    return expected === signature
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const sessionId = input.data?.session_id as string

    // Storefront re-creates the session after checkout to inject the
    // Razorpay response fields; reuse the already-paid order then.
    if (input.data?.razorpay_payment_id && input.data?.razorpay_order_id) {
      return {
        id: input.data.razorpay_order_id as string,
        status: "pending",
        data: { ...input.data },
      }
    }

    const amountPaise = this.toPaise(input.amount)
    const currency = input.currency_code.toUpperCase()

    const order = await this.client_.orders.create({
      amount: amountPaise,
      currency,
      receipt: sessionId,
      notes: { session_id: sessionId },
    })

    return {
      id: order.id,
      status: "pending",
      data: {
        razorpay_order_id: order.id,
        session_id: sessionId,
        amount: amountPaise,
        currency,
        key_id: this.options_.key_id,
      },
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const data = input.data ?? {}
    const paymentId = data.razorpay_payment_id as string
    const orderId = data.razorpay_order_id as string
    const signature = data.razorpay_signature as string

    if (!paymentId || !orderId || !signature) {
      return { status: "pending", data }
    }

    const valid = this.verifyCheckoutSignature(orderId, paymentId, signature)
    if (!valid) {
      return { status: "error", data: { ...data, error: "invalid_signature" } }
    }

    const payment = await this.client_.payments.fetch(paymentId)
    const status: PaymentSessionStatus =
      payment.status === "captured"
        ? "captured"
        : payment.status === "authorized"
          ? "authorized"
          : payment.status === "failed"
            ? "error"
            : "pending"

    return {
      status,
      data: { ...data, razorpay_payment_status: payment.status },
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const data = input.data ?? {}
    const paymentId = data.razorpay_payment_id as string

    if (paymentId) {
      const payment = await this.client_.payments.fetch(paymentId)
      if (payment.status === "authorized") {
        await this.client_.payments.capture(
          paymentId,
          payment.amount as number,
          payment.currency as string
        )
      }
    }
    return { data }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    // Razorpay orders auto-expire; nothing to cancel upstream.
    return { data: input.data ?? {} }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const data = input.data ?? {}
    const paymentId = data.razorpay_payment_id as string
    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot refund: missing razorpay_payment_id"
      )
    }
    const refund = await this.client_.payments.refund(paymentId, {
      amount: this.toPaise(input.amount),
    })
    return { data: { ...data, refund_id: refund.id } }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const orderId = input.data?.razorpay_order_id as string
    if (!orderId) {
      return { data: input.data ?? {} }
    }
    const order = await this.client_.orders.fetch(orderId)
    return { data: { ...(input.data ?? {}), order: order as unknown as Record<string, unknown> } }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    // Razorpay order amounts are immutable; create a fresh order for the new amount.
    const result = await this.initiatePayment({
      amount: input.amount,
      currency_code: input.currency_code,
      data: input.data,
      context: input.context,
    })
    return { data: result.data, status: "pending" }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const orderId = input.data?.razorpay_order_id as string
    if (!orderId) {
      return { status: "pending" }
    }
    const order = await this.client_.orders.fetch(orderId)
    const status: PaymentSessionStatus =
      order.status === "paid"
        ? "captured"
        : order.status === "attempted"
          ? "pending"
          : "pending"
    return { status }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data, rawData, headers } = payload
    const signature = (headers?.["x-razorpay-signature"] as string) ?? ""

    const expected = crypto
      .createHmac("sha256", this.options_.webhook_secret)
      .update(rawData as string)
      .digest("hex")

    if (expected !== signature) {
      return { action: "not_supported" }
    }

    const event = (data as Record<string, unknown>)?.event as string

    if (event === "order.paid") {
      const order = (data as any).payload?.order?.entity
      const sessionId = order?.notes?.session_id as string
      if (!sessionId) {
        return { action: "not_supported" }
      }
      return {
        action: "captured",
        data: {
          session_id: sessionId,
          amount: (order.amount as number) / 100,
        },
      }
    }

    if (event === "payment.failed") {
      const payment = (data as any).payload?.payment?.entity
      const orderId = payment?.order_id as string
      if (!orderId) {
        return { action: "not_supported" }
      }
      const order = await this.client_.orders.fetch(orderId)
      const sessionId = (order.notes as Record<string, unknown>)?.session_id as string
      if (!sessionId) {
        return { action: "not_supported" }
      }
      return {
        action: "failed",
        data: {
          session_id: sessionId,
          amount: Number(order.amount) / 100,
        },
      }
    }

    return { action: "not_supported" }
  }
}

export default RazorpayPaymentProviderService
