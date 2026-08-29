"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Wrench, Check, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useVehicle } from "@/hooks/useVehicle";
import { useCustomer } from "@/hooks/useCustomer";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart, loading, error } = useCart();
  const { customer } = useCustomer();
  const { selected } = useVehicle();
  const total = subtotal();

  if (loading && items.length === 0) {
    return <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20 text-center"><Loader2 className="h-12 w-12 animate-spin text-cyan" /><p className="mt-4 text-silver-muted">Loading your Medusa cart…</p></main>;
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20 text-center">
        <ShoppingBag className="h-16 w-16 text-silver-muted" />
        <h1 className="mt-6 font-display text-4xl uppercase text-foreground">Your Cart Is Empty</h1>
        <p className="mt-2 text-silver-muted">Start your build with products managed in Medusa.</p>
        {error && <p className="mt-3 max-w-md text-sm text-red">{error}</p>}
        <Button asChild className="mt-6 bg-cyan text-black hover:bg-cyan-light"><Link href="/shop">Shop Now</Link></Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">Your Cart</h1>
              <p className="mt-1 text-sm text-silver-muted">Quantities, pricing and line items are synchronized with Medusa.</p>
            </div>
            <Button variant="ghost" disabled={loading} onClick={() => void clearCart()} className="self-start text-silver-muted hover:text-red"><Trash2 className="mr-2 h-4 w-4" /> Clear Cart</Button>
          </motion.div>

          {error && <div className="mb-5 rounded-lg border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">{error}</div>}

          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <motion.div variants={fadeInUp} className="space-y-4">
              {items.map((item) => {
                const fits = selected ? item.product.compatibility.includes(selected.slug) : null;
                return (
                  <div key={item.id} className="flex flex-col gap-4 rounded-xl border border-border bg-raised p-4 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg sm:w-36"><Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="144px" /></div>
                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-silver-muted">{item.product.category}</p>
                          <Link href={`/products/${item.product.slug}`} className="font-display text-lg font-semibold uppercase text-foreground transition-colors hover:text-cyan">{item.product.name}</Link>
                          {fits === true && <p className="mt-1 inline-flex items-center gap-1 text-xs text-cyan"><Check className="h-3 w-3" /> Fits your vehicle</p>}
                          {fits === false && selected && <p className="mt-1 inline-flex items-center gap-1 text-xs text-red"><Wrench className="h-3 w-3" /> Check fitment for {selected.model}</p>}
                        </div>
                        <p className="font-display text-lg font-semibold text-foreground">{item.product.currency}{(item.product.price * item.quantity).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-border bg-background">
                          <button type="button" disabled={loading} onClick={() => void updateQuantity(item.id, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center text-foreground hover:text-cyan disabled:opacity-40"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                          <button type="button" disabled={loading} onClick={() => void updateQuantity(item.id, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center text-foreground hover:text-cyan disabled:opacity-40"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <button type="button" disabled={loading} onClick={() => void removeItem(item.id)} className="inline-flex items-center gap-1 text-sm text-silver-muted transition-colors hover:text-red disabled:opacity-40"><Trash2 className="h-4 w-4" /> Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            <motion.div variants={fadeInUp} className="h-fit rounded-xl border border-border bg-raised p-6">
              <h2 className="font-display text-xl uppercase text-foreground">Order Summary</h2>
              <Separator className="my-4 bg-border" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-silver-muted"><span>Subtotal</span><span>₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-silver-muted"><span>Shipping</span><span>Calculated during checkout</span></div>
                <div className="flex justify-between text-silver-muted"><span>Taxes</span><span>Calculated by Medusa</span></div>
              </div>
              <Separator className="my-4 bg-border" />
              <div className="flex justify-between font-display text-2xl font-semibold text-foreground"><span>Subtotal</span><span>₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div>

              <div className="mt-6 rounded-lg border border-cyan/20 bg-cyan/5 p-4 text-sm text-silver-muted">
                <div className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan" /><p>{customer ? `Cart attached to ${customer.email}.` : "Guest cart is persisted in Medusa. Sign in to attach it to your customer account."}</p></div>
              </div>

              {!customer && <Button asChild className="mt-4 w-full bg-cyan text-black hover:bg-cyan-light"><Link href="/account">Sign In / Create Account</Link></Button>}
              <Button disabled className="mt-3 w-full bg-cyan text-black disabled:cursor-not-allowed disabled:opacity-60">Checkout requires shipping & payment setup</Button>
              <p className="mt-2 text-center text-xs text-silver-muted">The previous fake checkout action has been disabled until Medusa shipping options and payment sessions are configured.</p>
              <Button asChild variant="outline" className="mt-4 w-full border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"><Link href="/shop" className="gap-2"><ArrowLeft className="h-4 w-4" /> Continue Shopping</Link></Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
