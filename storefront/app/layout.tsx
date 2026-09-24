import type { Metadata } from "next"
import { Archivo, Inter } from "next/font/google"
import "./globals.css"
import SmoothScroll from "@/components/SmoothScroll"
import Navbar from "@/components/Navbar"
import GhostLayer from "@/components/GhostLayer"
import MotionEffects from "@/components/MotionEffects"

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
        <GhostLayer />
        <MotionEffects />
        <SmoothScroll>
          <Navbar />
          {/* REF-1: the page presents as a floating rounded card over the backdrop */}
          <div data-site-content className="relative z-10 mx-2 my-2 overflow-clip rounded-[20px] border hairline bg-ink shadow-[0_0_80px_rgba(0,0,0,0.8)] md:mx-4 md:my-4 md:rounded-[28px]">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  )
}
