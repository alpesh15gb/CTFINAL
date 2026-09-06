"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Banknote, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { medusaClient } from "@/lib/medusa";
import { useCart } from "@/hooks/useCart";

type Step = "details" | "shipping" | "payment" | "done";

interface Details {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  city: string;
  province: string;
  postal_code: string;
}

const EMPTY: Details = {
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  address_1: "",
  city: "",
  province: "",
  postal_code: "",
};

interface ShipOption {
  id: string;
  name: string;
  amount: number;
}

function paiseToRupees(amount: number) {
  return Math.round(amount / 100);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const total = subtotal();

  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<Details>(EMPTY);
  const [cartId, setCartId] = useState<string | null>(null);
  const [options, setOptions] = useState<ShipOption[]>([]);
  const [optionId, setOptionId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const missingVariants = useMemo(
    () => items.filter((i) => !i.product.variantId),
    [items]
  );

  // A fresh Medusa cart per checkout visit (orphaned carts are harmless).
  useEffect(() => {
    if (items.length === 0) return;
    if (missingVariants.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const { regions } = await medusaClient.regions.list();
        const region = (regions ?? []).find(
          (r: { currency_code?: string }) =>
            String(r.currency_code ?? "").toLowerCase() === "inr"
        ) as { id: string } | undefined;
        if (!region) throw new Error("INR region not found on the store.");
        const { cart } = await medusaClient.carts.create({
          region_id: region.id,
        });
        for (const item of items) {
          if (cancelled || !item.product.variantId) continue;
          await medusaClient.carts.lineItems.create(cart.id, {
            variant_id: item.product.variantId,
            quantity: item.quantity,
          });
        }
        if (!cancelled) setCartId(cart.id);
      } catch (e) {
        console.error("[checkout] cart init failed:", e);
        if (!cancelled)
          setError(
            "Could not reach the store. Check your connection and retry."
          );
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0 && step !== "done") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20 text-center">
        <h1 className="font-display text-4xl uppercase text-foreground">
          Your Cart Is Empty
        </h1>
        <Button asChild className="mt-6 bg-red text-white hover:bg-red-deep">
          <Link href="/shop">Shop Now</Link>
        </Button>
      </main>
    );
  }

  if (missingVariants.length > 0 && step !== "done") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20 text-center">
        <h1 className="font-display text-4xl uppercase text-foreground">
          Cart Needs Refresh
        </h1>
        <p className="mt-2 max-w-sm text-silver-muted">
          Some items were saved before checkout was enabled. Please remove and
          re-add them from the shop.
        </p>
        <Button asChild className="mt-6 bg-red text-white hover:bg-red-deep">
          <Link href="/cart">Back to Cart</Link>
        </Button>
      </main>
    );
  }

  const set = (key: keyof Details, value: string) =>
    setDetails((d) => ({ ...d, [key]: value }));

  const detailsValid =
    /.+@.+\..+/.test(details.email) &&
    details.first_name.trim() !== "" &&
    details.phone.trim() !== "" &&
    details.address_1.trim() !== "" &&
    details.city.trim() !== "" &&
    details.postal_code.trim() !== "";

  async function submitDetails() {
    if (!cartId || !detailsValid || busy) return;
    setBusy(true);
    setError(null);
    try {
      await medusaClient.carts.update(cartId, {
        email: details.email,
        shipping_address: {
          first_name: details.first_name,
          last_name: details.last_name,
          phone: details.phone,
          address_1: details.address_1,
          city: details.city,
          province: details.province,
          postal_code: details.postal_code,
          country_code: "in",
        },
      });
      const res = await medusaClient.shippingOptions.listCartOptions(cartId);
      const list = ((res as unknown as { shipping_options?: unknown[] })
        ?.shipping_options ?? []) as {
        id: string;
        name: string;
        amount: number;
      }[];
      if (!list.length)
        throw new Error("No shipping options for this cart yet.");
      setOptions(
        list.map((o) => ({ id: o.id, name: o.name, amount: o.amount ?? 0 }))
      );
      setOptionId(list[0].id);
      setStep("shipping");
    } catch (e) {
      console.error("[checkout] details failed:", e);
      setError("Could not save address. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  async function submitShipping() {
    if (!cartId || !optionId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await medusaClient.carts.addShippingMethod(cartId, {
        option_id: optionId,
      });
      await medusaClient.carts.createPaymentSessions(cartId);
      setStep("payment");
    } catch (e) {
      console.error("[checkout] shipping failed:", e);
      setError("Could not set shipping method. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  async function placeOrder() {
    if (!cartId || busy) return;
    setBusy(true);
    setError(null);
    try {
      // Cash on Delivery rides on the manual payment provider.
      await medusaClient.carts.setPaymentSession(cartId, {
        provider_id: "manual",
      });
      const res = (await medusaClient.carts.complete(cartId)) as unknown as {
        type?: string;
        data?: { id?: string; display_id?: number };
      };
      if (res?.type !== "order" || !res?.data)
        throw new Error("Cart could not be completed.");
      setOrderId(
        res.data.display_id ? `#${res.data.display_id}` : res.data.id ?? null
      );
      clearCart();
      setStep("done");
    } catch (e) {
      console.error("[checkout] place order failed:", e);
      setError("Order could not be placed. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  const shippingCost = options.find((o) => o.id === optionId)?.amount ?? 0;

  if (step === "done") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600/15 text-green-500">
          <Check className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-4xl uppercase text-foreground">
          Order Placed
        </h1>
        <p className="mt-2 max-w-sm text-silver-muted">
          {orderId ? `Order ${orderId} is confirmed. ` : ""}Pay in cash when
          your upgrades arrive. We will call to confirm fitment and delivery.
        </p>
        <Button asChild className="mt-6 bg-red text-white hover:bg-red-deep">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </main>
    );
  }

  const field = (
    key: keyof Details,
    label: string,
    props?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-silver-muted">
        {label}
      </span>
      <Input
        value={details[key]}
        onChange={(e) => set(key, e.target.value)}
        className="border-border bg-raised text-foreground"
        {...props}
      />
    </label>
  );

  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-silver-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </button>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
          Checkout
        </h1>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          {(["details", "shipping", "payment"] as Step[]).map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span
                className={
                  step === s ? "text-cyan-deep" : "text-silver-muted"
                }
              >
                {i + 1}. {s}
              </span>
              {i < 2 && <span className="text-silver-muted">/</span>}
            </span>
          ))}
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-red/40 bg-red/10 p-4 text-sm text-red">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            {step === "details" && (
              <section className="space-y-4">
                <h2 className="font-display text-xl uppercase text-foreground">
                  Delivery Details
                </h2>
                {field("email", "Email", {
                  type: "email",
                  placeholder: "you@example.com",
                })}
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("first_name", "First name")}
                  {field("last_name", "Last name (optional)")}
                </div>
                {field("phone", "Phone", { placeholder: "+91 …" })}
                {field("address_1", "Address")}
                <div className="grid gap-4 sm:grid-cols-3">
                  {field("city", "City")}
                  {field("province", "State")}
                  {field("postal_code", "Pincode")}
                </div>
                <Button
                  onClick={submitDetails}
                  disabled={!detailsValid || !cartId || busy}
                  className="mt-2 w-full bg-red text-white hover:bg-red-deep sm:w-auto"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Continue to Shipping"
                  )}
                </Button>
                {!cartId && !error && (
                  <p className="text-sm text-silver-muted">
                    Preparing your order…
                  </p>
                )}
              </section>
            )}

            {step === "shipping" && (
              <section className="space-y-4">
                <h2 className="font-display text-xl uppercase text-foreground">
                  Shipping Method
                </h2>
                {options.map((o) => (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${
                      optionId === o.id
                        ? "border-cyan-deep/60 bg-cyan/5"
                        : "border-border bg-raised"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={optionId === o.id}
                        onChange={() => setOptionId(o.id)}
                        className="h-4 w-4 accent-cyan"
                      />
                      <span className="font-medium text-foreground">
                        {o.name}
                      </span>
                    </span>
                    <span className="text-foreground">
                      {o.amount === 0
                        ? "Free"
                        : `₹${paiseToRupees(o.amount).toLocaleString("en-IN")}`}
                    </span>
                  </label>
                ))}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("details")}
                    className="border-border bg-transparent text-foreground"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={submitShipping}
                    disabled={!optionId || busy}
                    className="bg-red text-white hover:bg-red-deep"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </div>
              </section>
            )}

            {step === "payment" && (
              <section className="space-y-4">
                <h2 className="font-display text-xl uppercase text-foreground">
                  Payment
                </h2>
                <div className="flex items-center gap-3 rounded-xl border border-cyan-deep/60 bg-cyan/5 p-4">
                  <Banknote className="h-6 w-6 text-cyan-deep" />
                  <div>
                    <p className="font-medium text-foreground">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-silver-muted">
                      Pay in cash/UPI when your order arrives. Online payments
                      coming soon.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("shipping")}
                    className="border-border bg-transparent text-foreground"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={placeOrder}
                    disabled={busy}
                    className="bg-red text-white hover:bg-red-deep"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `Place Order • ₹${(
                        total + paiseToRupees(shippingCost)
                      ).toLocaleString("en-IN")}`
                    )}
                  </Button>
                </div>
              </section>
            )}
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-xl border border-border bg-raised p-6">
            <h2 className="font-display text-xl uppercase text-foreground">
              Summary
            </h2>
            <Separator className="my-4 bg-border" />
            <div className="space-y-3 text-sm">
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between gap-3">
                  <span className="text-silver-muted">
                    {i.product.name} × {i.quantity}
                  </span>
                  <span className="shrink-0 text-foreground">
                    ₹{(i.product.price * i.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-silver-muted">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-silver-muted">
                <span>Shipping</span>
                <span>
                  {step === "details"
                    ? "—"
                    : shippingCost === 0
                      ? "Free"
                      : `₹${paiseToRupees(shippingCost).toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>
            <Separator className="my-4 bg-border" />
            <div className="flex justify-between font-display text-2xl font-semibold text-foreground">
              <span>Total</span>
              <span>
                ₹
                {(
                  total + (step === "details" ? 0 : paiseToRupees(shippingCost))
                ).toLocaleString("en-IN")}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
