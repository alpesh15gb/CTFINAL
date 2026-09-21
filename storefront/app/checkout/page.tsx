import { redirect } from "next/navigation"
import { getCart } from "@/app/actions/cart"
import CheckoutFlow from "@/components/shop/CheckoutFlow"
import Footer from "@/components/Footer"

export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  const cart = await getCart()
  if (!cart || (cart.items ?? []).length === 0) redirect("/shop")

  return (
    <main className="pt-24">
      <div className="mx-auto max-w-[1100px] px-6 pb-32">
        <p className="eyebrow mb-4">Almost Yours</p>
        <h1 className="display-lg mb-12">Checkout</h1>
        <CheckoutFlow cart={cart} />
      </div>
      <Footer />
    </main>
  )
}
