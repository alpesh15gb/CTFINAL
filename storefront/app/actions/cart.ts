"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { storeFetch, getRegionId } from "@/lib/store"

const CART_COOKIE = "cartunez_cart_id"

async function getCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value
}

async function setCartId(id: string) {
  ;(await cookies()).set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function getCart() {
  const cartId = await getCartId()
  if (!cartId) return null
  try {
    const data = await storeFetch<{ cart: any }>(
      `/carts/${cartId}?fields=+items.*,+items.variant.*,+items.product.*,+shipping_methods.*,+total,+subtotal,+email`
    )
    return data.cart
  } catch {
    return null
  }
}

export async function addToCart(variantId: string, quantity = 1) {
  let cartId = await getCartId()

  if (!cartId) {
    const regionId = await getRegionId()
    const data = await storeFetch<{ cart: any }>("/carts", {
      method: "POST",
      body: JSON.stringify({ region_id: regionId }),
    })
    cartId = data.cart.id
    await setCartId(cartId!)
  }

  try {
    await storeFetch(`/carts/${cartId}/line-items`, {
      method: "POST",
      body: JSON.stringify({ variant_id: variantId, quantity }),
    })
  } catch {
    // Cart may be stale/completed upstream — start a fresh one once.
    const regionId = await getRegionId()
    const data = await storeFetch<{ cart: any }>("/carts", {
      method: "POST",
      body: JSON.stringify({ region_id: regionId }),
    })
    cartId = data.cart.id
    await setCartId(cartId!)
    await storeFetch(`/carts/${cartId}/line-items`, {
      method: "POST",
      body: JSON.stringify({ variant_id: variantId, quantity }),
    })
  }

  revalidatePath("/cart")
  return { cartId }
}

export async function updateLineItem(lineItemId: string, quantity: number) {
  const cartId = await getCartId()
  if (!cartId) return
  if (quantity <= 0) {
    await storeFetch(`/carts/${cartId}/line-items/${lineItemId}`, {
      method: "DELETE",
    })
  } else {
    await storeFetch(`/carts/${cartId}/line-items/${lineItemId}`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    })
  }
  revalidatePath("/cart")
}

export async function updateCartDetails(input: {
  email: string
  firstName: string
  lastName: string
  phone: string
  address1: string
  city: string
  province: string
  postalCode: string
}) {
  const cartId = await getCartId()
  if (!cartId) throw new Error("No cart")

  const address = {
    first_name: input.firstName,
    last_name: input.lastName,
    address_1: input.address1,
    city: input.city,
    province: input.province,
    postal_code: input.postalCode,
    country_code: "in",
    phone: input.phone,
  }

  await storeFetch(`/carts/${cartId}`, {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      shipping_address: address,
      billing_address: address,
    }),
  })
}

export async function getShippingOptions() {
  const cartId = await getCartId()
  if (!cartId) return []
  const data = await storeFetch<{ shipping_options: any[] }>(
    `/shipping-options?cart_id=${cartId}`
  )
  return data.shipping_options
}

export async function selectShipping(optionId: string) {
  const cartId = await getCartId()
  if (!cartId) throw new Error("No cart")
  await storeFetch(`/carts/${cartId}/shipping-methods`, {
    method: "POST",
    body: JSON.stringify({ option_id: optionId }),
  })
}

export async function createRazorpaySession() {
  const cartId = await getCartId()
  if (!cartId) throw new Error("No cart")

  const collection = await storeFetch<{ payment_collection: any }>(
    "/payment-collections",
    { method: "POST", body: JSON.stringify({ cart_id: cartId }) }
  )

  const session = await storeFetch<{ payment_collection: any }>(
    `/payment-collections/${collection.payment_collection.id}/payment-sessions`,
    {
      method: "POST",
      body: JSON.stringify({ provider_id: "pp_razorpay_razorpay" }),
    }
  )

  const paymentSession = session.payment_collection.payment_sessions?.[0]
  if (!paymentSession?.data?.razorpay_order_id) {
    throw new Error("Razorpay session not created")
  }
  return {
    collectionId: session.payment_collection.id,
    orderId: paymentSession.data.razorpay_order_id as string,
    amount: paymentSession.data.amount as number,
    currency: (paymentSession.data.currency as string) ?? "INR",
    keyId:
      (paymentSession.data.key_id as string) ??
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ??
      "",
  }
}

export async function finalizeRazorpayPayment(input: {
  collectionId: string
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}) {
  const cartId = await getCartId()
  if (!cartId) throw new Error("No cart")

  // Re-create the session with the Razorpay response so authorization can
  // verify the signature (provider reuses the existing order).
  await storeFetch(
    `/payment-collections/${input.collectionId}/payment-sessions`,
    {
      method: "POST",
      body: JSON.stringify({
        provider_id: "pp_razorpay_razorpay",
        data: {
          razorpay_payment_id: input.razorpay_payment_id,
          razorpay_order_id: input.razorpay_order_id,
          razorpay_signature: input.razorpay_signature,
        },
      }),
    }
  )

  const completed = await storeFetch<{ type: string; order?: any }>(
    `/carts/${cartId}/complete`,
    { method: "POST" }
  )

  if (completed.type === "order" && completed.order) {
    ;(await cookies()).delete(CART_COOKIE)
    return { orderId: completed.order.id as string }
  }
  throw new Error("Cart completion failed")
}
