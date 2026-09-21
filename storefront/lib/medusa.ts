import { storeFetch, getRegionId } from "@/lib/store"

export type StoreProduct = {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string | null
  images?: { url: string }[]
  variants?: {
    id: string
    title: string
    calculated_price?: { calculated_amount: number; currency_code: string }
  }[]
  categories?: { id: string; name: string; handle: string }[]
}

const PRODUCT_FIELDS = encodeURIComponent("+categories.*")

export async function fetchProducts(
  limit = 8
): Promise<{ products: StoreProduct[]; live: boolean }> {
  try {
    const regionId = await getRegionId()
    const data = await storeFetch<{ products: StoreProduct[] }>(
      `/products?limit=${limit}&region_id=${regionId}&fields=${PRODUCT_FIELDS}`,
      {},
      300
    )
    return { products: data.products ?? [], live: true }
  } catch {
    // ARCHITECTURE failure mode: Medusa down -> caller renders fallback
    return { products: [], live: false }
  }
}
