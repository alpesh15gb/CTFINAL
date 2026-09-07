import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-silver-muted">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl uppercase text-foreground">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-sm text-silver-muted">
        This page was moved, removed, or never existed.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild className="bg-red text-white hover:bg-red-deep">
          <Link href="/">Back Home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-border bg-transparent text-foreground hover:border-cyan-deep hover:text-cyan-deep"
        >
          <Link href="/shop">Shop Now</Link>
        </Button>
      </div>
    </main>
  );
}
