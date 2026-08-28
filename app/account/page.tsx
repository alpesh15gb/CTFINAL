"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { User, LogOut, Package, Heart, ShoppingBag, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCustomer } from "@/hooks/useCustomer";
import { useWishlist } from "@/hooks/useWishlist";
import { minorToMajor } from "@/lib/medusa";

export default function AccountPage() {
  const { customer, orders, initialized, loading, error, login, register, logout, updateProfile } = useCustomer();
  const { count: wishlistCount } = useWishlist();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [saved, setSaved] = useState(false);

  if (!initialized && loading) {
    return <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20"><Loader2 className="h-10 w-10 animate-spin text-cyan" /><p className="mt-4 text-silver-muted">Checking your Medusa account session…</p></main>;
  }

  if (!customer) {
    return (
      <main className="min-h-screen bg-background px-4 pb-24 pt-28">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-raised p-6 md:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan/40 text-cyan"><User className="h-7 w-7" /></div>
          <h1 className="mt-5 font-display text-4xl uppercase text-foreground">{mode === "login" ? "Sign In" : "Create Account"}</h1>
          <p className="mt-2 text-silver-muted">{mode === "login" ? "Sign in to your Medusa customer account to view orders and sync your wishlist." : "Create a Medusa customer account. Your current cart and wishlist will be attached after registration."}</p>
          <AccountForm mode={mode} loading={loading} onLogin={login} onRegister={register} />
          {error && <p className="mt-4 rounded-lg border border-red/30 bg-red/10 px-3 py-2 text-sm text-red">{error}</p>}
          <Separator className="my-6 bg-border" />
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-sm text-cyan hover:underline">
            {mode === "login" ? "New to Cartunez? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </main>
    );
  }

  const displayName = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email;

  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Medusa Customer</p>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase text-foreground md:text-5xl">{displayName}</h1>
            <p className="mt-2 text-silver-muted">{customer.email}</p>
          </div>
          <Button variant="outline" disabled={loading} onClick={() => void logout()} className="self-start border-border bg-transparent text-foreground hover:border-red hover:text-red"><LogOut className="mr-2 h-4 w-4" /> Sign Out</Button>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">{error}</div>}

        <div className="grid gap-6 md:grid-cols-3">
          <AccountLink href="/cart" icon={<ShoppingBag className="h-5 w-5" />} title="Cart" detail="Synced with Medusa" />
          <AccountLink href="/wishlist" icon={<Heart className="h-5 w-5" />} title="Wishlist" detail={`${wishlistCount} saved item${wishlistCount === 1 ? "" : "s"}`} />
          <div className="rounded-xl border border-border bg-raised p-5"><ShieldCheck className="h-5 w-5 text-cyan" /><h2 className="mt-3 font-display text-xl uppercase text-foreground">Session Active</h2><p className="mt-1 text-sm text-silver-muted">Your cart is attached to customer ID {customer.id.slice(0, 12)}…</p></div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
          <ProfileCard customer={customer} loading={loading} saved={saved} onSave={async (payload) => { const ok = await updateProfile(payload); setSaved(ok); if (ok) window.setTimeout(() => setSaved(false), 1600); }} />

          <section className="rounded-xl border border-border bg-raised p-6">
            <div className="flex items-center gap-3"><Package className="h-5 w-5 text-cyan" /><h2 className="font-display text-2xl uppercase text-foreground">Orders</h2></div>
            <Separator className="my-5 bg-border" />
            {orders.length === 0 ? (
              <div className="py-12 text-center"><Package className="mx-auto h-10 w-10 text-silver-muted" /><p className="mt-3 text-silver-muted">No orders found for this Medusa customer yet.</p><Button asChild className="mt-5 bg-cyan text-black hover:bg-cyan-light"><Link href="/shop">Start Shopping</Link></Button></div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="font-display text-lg uppercase text-foreground">Order #{order.display_id}</p><p className="text-xs text-silver-muted">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p></div>
                    <div className="text-left sm:text-right"><p className="font-display text-lg text-foreground">{order.currency_code.toUpperCase()} {minorToMajor(order.total, order.currency_code).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p><p className="text-xs uppercase tracking-wider text-cyan">{order.fulfillment_status || order.status || "placed"}</p></div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function AccountForm({ mode, loading, onLogin, onRegister }: {
  mode: "login" | "register";
  loading: boolean;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (payload: { email: string; password: string; first_name: string; last_name: string }) => Promise<boolean>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "login") await onLogin(email.trim(), password);
    else await onRegister({ email: email.trim(), password, first_name: firstName.trim(), last_name: lastName.trim() });
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {mode === "register" && <div className="grid gap-4 sm:grid-cols-2"><Input required placeholder="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="border-border bg-background text-foreground" /><Input required placeholder="Last name" value={lastName} onChange={(event) => setLastName(event.target.value)} className="border-border bg-background text-foreground" /></div>}
      <Input required type="email" autoComplete="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} className="border-border bg-background text-foreground" />
      <Input required minLength={8} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} className="border-border bg-background text-foreground" />
      <Button disabled={loading} type="submit" className="w-full bg-cyan text-black hover:bg-cyan-light">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{mode === "login" ? "Sign In" : "Create Account"}</Button>
    </form>
  );
}

function ProfileCard({ customer, loading, saved, onSave }: {
  customer: NonNullable<ReturnType<typeof useCustomer>["customer"]>;
  loading: boolean;
  saved: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState(customer.first_name || "");
  const [lastName, setLastName] = useState(customer.last_name || "");
  const [phone, setPhone] = useState(customer.phone || "");

  return (
    <form onSubmit={(event) => { event.preventDefault(); void onSave({ first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim() || null }); }} className="h-fit rounded-xl border border-border bg-raised p-6">
      <h2 className="font-display text-2xl uppercase text-foreground">Profile</h2>
      <p className="mt-1 text-sm text-silver-muted">Updates are saved directly to your Medusa customer record.</p>
      <div className="mt-5 space-y-3"><Input placeholder="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="border-border bg-background text-foreground" /><Input placeholder="Last name" value={lastName} onChange={(event) => setLastName(event.target.value)} className="border-border bg-background text-foreground" /><Input type="tel" placeholder="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="border-border bg-background text-foreground" /></div>
      <Button disabled={loading} type="submit" className="mt-4 w-full bg-cyan text-black hover:bg-cyan-light">{saved ? "Saved" : "Save Profile"}</Button>
    </form>
  );
}

function AccountLink({ href, icon, title, detail }: { href: string; icon: React.ReactNode; title: string; detail: string }) {
  return <Link href={href} className="group rounded-xl border border-border bg-raised p-5 transition-colors hover:border-cyan/40"><div className="text-cyan">{icon}</div><h2 className="mt-3 font-display text-xl uppercase text-foreground group-hover:text-cyan">{title}</h2><p className="mt-1 text-sm text-silver-muted">{detail}</p></Link>;
}
