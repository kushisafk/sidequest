import type { Metadata } from "next"
import { Press_Start_2P, VT323 } from "next/font/google"
import "./globals.css"
import { Providers } from "@/app/providers"
import { Header } from "@/components/Header"
import { RetroBackground } from "@/components/RetroBackground"
import { BackButton } from "@/components/BackButton"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "block",
  variable: "--font-pixel-loaded",
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "block",
  variable: "--font-mono-loaded",
})

export const metadata: Metadata = {
  title: "SideQuest — Failed Project Graveyard",
  description: "A memorial for failed side projects. Rest in peace, sweet code.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`h-full ${pressStart2P.variable} ${vt323.variable}`}>
      <body className="min-h-screen bg-[#1a1a0e]" style={{ fontFamily: "'VT323', monospace" }}>
        <RetroBackground />
        <Providers>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <BackButton />
            <footer className="bg-stone-900/80 border-t-2 border-amber-700 py-3 text-center font-mono text-stone-500 text-base">
              © 2026 SideQuest — May your code rest in peace
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
