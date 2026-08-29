"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { useVehicle } from "@/hooks/useVehicle";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity, subtotal, totalItems, loading, error } = useCart();
  const { selected } = useVehicle();
  const total = subtotal();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col border-border bg-raised text-foreground sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl uppercase tracking-wide text-foreground">Your Cart ({totalItems()})</SheetTitle>
        </SheetHeader>

        {error && <div className="mt-3 rounded-md border border-red/30 bg-red/10 px-3 py-2 text-sm text-red">{error}</div>}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {loading ? <Loader2 className="h-12 w-12 animate-spin text-cyan" /> : <ShoppingBag className="h-12 w-12 text-silver-muted" />}
            <p className="mt-4 text-silver-muted">{loading ? "Loading your Medusa cart…" : "Your cart is empty."}</p>
            {!loading && (
              <SheetClose asChild><Button asChild className="mt-4 bg-cyan text-black hover:bg-cyan-light"><Link href="/shop">Shop Now</Link></Button></SheetClose>
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => {
                  const fits = selected ? item.product.compatibility.includes(selected.slug) : null;
                  return (
                    <div key={item.id} className="flex gap-4 rounded-lg border border-border bg-background p-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link href={`/products/${item.product.slug}`} className="font-display text-sm font-semibold uppercase leading-tight text-foreground transition-colors hover:text-cyan">{item.product.name}</Link>
                          {fits === true && <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-cyan"><Check className="h-3 w-3" /> Fits</p>}
                          {fits === false && <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-red"><X className="h-3 w-3" /> Check fit</p>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded border border-border">
                            <button type="button" disabled={loading} onClick={() => void updateQuantity(item.id, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center text-foreground hover:text-cyan disabled:opacity-40"><Minus className="h-3 w-3" /></button>
                            <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                            <button type="button" disabled={loading} onClick={() => void updateQuantity(item.id, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center text-foreground hover:text-cyan disabled:opacity-40"><Plus className="h-3 w-3" /></button>
                          </div>
                          <span className="text-sm font-medium text-foreground">{item.product.currency}{(item.product.price * item.quantity).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      <button type="button" disabled={loading} onClick={() => void removeItem(item.id)} className="self-start text-silver-muted transition-colors hover:text-red disabled:opacity-40" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  );
                })}
              </div>
            </div>

            <SheetFooter className="flex-col border-t border-border pt-4">
              <div className="flex w-full justify-between text-foreground"><span className="text-sm text-silver-muted">Medusa subtotal</span><span className="font-display text-xl font-semibold">₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div>
              <SheetClose asChild><Button asChild className="w-full gap-2 bg-cyan text-black hover:bg-cyan-light"><Link href="/cart">View Cart <ArrowRight className="h-4 w-4" /></Link></Button></SheetClose>
              <SheetClose asChild><Button variant="outline" className="w-full border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan">Continue Shopping</Button></SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
