import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Space_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Cartunez — Premium Car Accessories & Customization",
  description:
    "Get your car rolling in style. Premium accessories, styling and performance upgrades built around your ride.",
  keywords: [
    "car accessories",
    "automotive styling",
    "performance upgrades",
    "car customization",
    "Cartunez",
  ],
  openGraph: {
    title: "Cartunez — Premium Car Accessories & Customization",
    description: "Get your car rolling in style.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cartunez — Premium Car Accessories & Customization",
    description: "Get your car rolling in style.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased" suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <MotionProvider>
          <SmoothScroll>
            <ScrollProgress />
            <Navbar />
            <div id="main-content" tabIndex={-1}>
              {children}
            </div>
            <Footer />
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
