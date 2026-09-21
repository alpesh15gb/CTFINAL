const BACKEND =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

export async function storeFetch<T = any>(
  path: string,
  init: RequestInit = {},
  revalidate = 0
): Promise<T> {
  const res = await fetch(`${BACKEND}/store${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
      ...(init.headers ?? {}),
    },
    ...(init.body ? {} : { next: { revalidate } }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Medusa ${path} -> ${res.status}: ${text.slice(0, 300)}`)
  }
  return res.json()
}

export async function getRegionId(): Promise<string> {
  const data = await storeFetch<{ regions: { id: string }[] }>(
    "/regions",
    {},
    3600
  )
  return data.regions[0].id
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}
