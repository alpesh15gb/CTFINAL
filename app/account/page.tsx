"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border text-cyan-deep">
        <User className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-4xl uppercase text-foreground">
        Account
      </h1>
      <p className="mt-2 max-w-sm text-silver-muted">
        Sign in to view your orders, saved vehicles and wishlist.
      </p>
      <Button asChild className="mt-6 bg-red text-white hover:bg-red-deep">
        <Link href="/">Back Home</Link>
      </Button>
    </main>
  );
}
