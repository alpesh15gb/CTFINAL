"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import {
  updateCartDetails,
  getShippingOptions,
  selectShipping,
  createRazorpaySession,
  finalizeRazorpayPayment,
} from "@/app/actions/cart"
import { formatINR } from "@/lib/store"

declare global {
  interface Window {
    Razorpay?: any
  }
}

type Step = "details" | "shipping" | "payment"

export default function CheckoutFlow({ cart }: { cart: any }) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("details")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [shippingId, setShippingId] = useState("")
  const [rzReady, setRzReady] = useState(false)
  const [form, setForm] = useState({
    email: cart.email ?? "",
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    city: "Hyderabad",
    province: "Telangana",
    postalCode: "",
  })

  const items = cart.items ?? []
  const total = cart.total ?? cart.subtotal ?? 0

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      await updateCartDetails(form)
      const options = await getShippingOptions()
      setShippingOptions(options)
      if (options.length > 0) setShippingId(options[0].id)
      setStep("shipping")
    } catch (err: any) {
      setError(err.message ?? "Could not save details")
    } finally {
      setBusy(false)
    }
  }

  const submitShipping = async () => {
    setBusy(true)
    setError("")
    try {
      await selectShipping(shippingId)
      setStep("payment")
    } catch (err: any) {
      setError(err.message ?? "Could not set shipping")
    } finally {
      setBusy(false)
    }
  }

  const pay = async () => {
    setBusy(true)
    setError("")
    try {
      const session = await createRazorpaySession()
      if (!window.Razorpay) {
        throw new Error("Payment gateway still loading — try again in a second")
      }

      const rzp = new window.Razorpay({
        key: session.keyId,
        amount: session.amount,
        currency: session.currency,
        name: "Cartunez",
        description: "Your build list",
        order_id: session.orderId,
        prefill: { email: form.email, contact: form.phone },
        theme: { color: "#E10600", backdrop_color: "#0A0A0B" },
        handler: async (response: any) => {
          try {
            const { orderId } = await finalizeRazorpayPayment({
              collectionId: session.collectionId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })
            router.push(`/order/${orderId}`)
          } catch (err: any) {
            setError(err.message ?? "Payment verification failed — contact the studio")
            setBusy(false)
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      })
      rzp.on("payment.failed", () => {
        setError("Payment failed. No money was captured — please retry.")
        setBusy(false)
      })
      rzp.open()
    } catch (err: any) {
      const raw = String(err?.message ?? "")
      setError(
        raw.includes("payment-sessions")
          ? "Payment gateway is being configured on our side — please WhatsApp +91 99496 95030 and we'll complete your order right away."
          : raw || "Could not start payment"
      )
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-16 md:grid-cols-[1fr_360px]">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onReady={() => setRzReady(true)}
      />

      <div>
        <StepNav step={step} />

        {step === "details" && (
          <form onSubmit={submitDetails} className="mt-10 grid grid-cols-2 gap-4">
            <Field label="Email" value={form.email} onChange={set("email")} type="email" required className="col-span-2" />
            <Field label="First name" value={form.firstName} onChange={set("firstName")} required />
            <Field label="Last name" value={form.lastName} onChange={set("lastName")} required />
            <Field label="Phone" value={form.phone} onChange={set("phone")} type="tel" required className="col-span-2" />
            <Field label="Address" value={form.address1} onChange={set("address1")} required className="col-span-2" />
            <Field label="City" value={form.city} onChange={set("city")} required />
            <Field label="State" value={form.province} onChange={set("province")} required />
            <Field label="PIN code" value={form.postalCode} onChange={set("postalCode")} required />
            <div className="col-span-2 mt-6">
              <button
                type="submit"
                disabled={busy}
                className="eyebrow bg-signal px-10 py-4 text-paper transition-transform hover:scale-[1.03] disabled:opacity-50"
              >
                {busy ? "Saving…" : "Continue"}
              </button>
            </div>
          </form>
        )}

        {step === "shipping" && (
          <div className="mt-10">
            <div className="space-y-4">
              {shippingOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center justify-between border p-5 transition-colors ${
                    shippingId === opt.id ? "border-signal" : "hairline hover:border-signal/50"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingId === opt.id}
                      onChange={() => setShippingId(opt.id)}
                      className="accent-[#E10600]"
                    />
                    <span>
                      <span className="block font-display font-700 uppercase">{opt.name}</span>
                      <span className="block text-sm text-muted">{opt.type?.description}</span>
                    </span>
                  </span>
                  <span className="font-display font-700">
                    {opt.amount === 0 ? "Free" : formatINR(opt.amount)}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={submitShipping}
              disabled={busy || !shippingId}
              className="eyebrow mt-8 bg-signal px-10 py-4 text-paper transition-transform hover:scale-[1.03] disabled:opacity-50"
            >
              {busy ? "Saving…" : "Continue to Payment"}
            </button>
          </div>
        )}

        {step === "payment" && (
          <div className="mt-10">
            <p className="text-muted">
              You&apos;ll pay securely via Razorpay — UPI, cards, netbanking and
              wallets accepted.
            </p>
            <button
              onClick={pay}
              disabled={busy || !rzReady}
              className="eyebrow mt-8 bg-signal px-10 py-4 text-paper transition-transform hover:scale-[1.03] disabled:opacity-50"
            >
              {busy ? "Opening Razorpay…" : `Pay ${formatINR(total)}`}
            </button>
          </div>
        )}

        {error && (
          <p className="mt-6 border border-signal/60 bg-signal/10 p-4 text-sm text-paper">
            {error}
          </p>
        )}
      </div>

      <aside className="h-fit border hairline bg-surface/40 p-6 md:sticky md:top-28">
        <p className="eyebrow mb-6">Order Summary</p>
        {items.map((item: any) => (
          <div key={item.id} className="mb-4 flex justify-between gap-4 text-sm">
            <span className="text-muted">
              {item.quantity} × {item.product?.title ?? item.title}
            </span>
            <span>{formatINR((item.unit_price ?? 0) * item.quantity)}</span>
          </div>
        ))}
        <div className="mt-6 flex justify-between border-t hairline pt-4 font-display font-800">
          <span>Total</span>
          <span className="text-signal">{formatINR(total)}</span>
        </div>
      </aside>
    </div>
  )
}

function StepNav({ step }: { step: Step }) {
  const steps: [Step, string][] = [
    ["details", "Details"],
    ["shipping", "Fitting / Delivery"],
    ["payment", "Payment"],
  ]
  const active = steps.findIndex(([s]) => s === step)
  return (
    <div className="flex gap-8 border-b hairline pb-4">
      {steps.map(([s, label], i) => (
        <span
          key={s}
          className={`eyebrow ${i <= active ? "text-paper" : "text-muted/50"}`}
        >
          {String(i + 1).padStart(2, "0")} {label}
        </span>
      ))}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className = "",
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow mb-2 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border hairline bg-surface/40 px-4 py-3 text-paper outline-none transition-colors focus:border-signal"
      />
    </label>
  )
}
