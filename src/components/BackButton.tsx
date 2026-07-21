"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

export function BackButton() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <Link
      href="/"
      className="fixed bottom-20 left-6 z-30 flex items-center gap-1.5 font-pixel text-[10px] text-amber-500 bg-stone-900/80 border border-amber-700/50 px-3 py-2 hover:bg-stone-800 hover:text-amber-300 hover:border-amber-500 transition-all duration-300 rounded-sm animate-glow-pulse"
    >
      ← BACK
    </Link>
  )
}
