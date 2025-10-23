import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "ksbm astro",
  description: "Instant expert consultation via chat & calls. Recharge wallet and pay per minute.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SiteHeader />
        <main className="min-h-[calc(100dvh-64px)]">{children}</main>
        <SiteFooter />
        <Suspense fallback={null} />
        <Analytics />
      </body>
    </html>
  )
}
