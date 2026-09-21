import type { Metadata } from "next"
import { Archivo, Inter } from "next/font/google"
import "./globals.css"
import SmoothScroll from "@/components/SmoothScroll"
import Navbar from "@/components/Navbar"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Cartunez — Automotive Customization, Hyderabad",
  description:
    "Premium car customization studio in Secunderabad. Upholstery, audio, lighting, alloys and ECU remapping. Built around you.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
        <div aria-hidden className="grain" />
      </body>
    </html>
  )
}
