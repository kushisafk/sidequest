"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-stone-900 border-b-2 border-amber-700 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-pixel text-xl text-amber-400 hover:text-amber-300 transition-colors tracking-wider">
          SIDEQUEST
        </Link>
        <nav className="flex items-center gap-5 text-base font-mono">
          <Link href="/projects" className="text-stone-300 hover:text-amber-400 transition-colors">
            Browse
          </Link>
          <Link href="/create" className="text-stone-300 hover:text-amber-400 transition-colors">
            Memorialize
          </Link>
          <Link href="/about" className="text-stone-300 hover:text-amber-400 transition-colors">
            Lore
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-3 border-l-2 border-amber-700/40 pl-4">
              <div className="w-7 h-7 relative overflow-hidden border border-stone-600 bg-stone-800 flex-shrink-0">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <span className="text-stone-500 text-xs flex items-center justify-center w-full h-full">?</span>
                )}
              </div>
              <span className="text-amber-400 text-sm font-bold tracking-wide">{session.user.name}</span>
              {session.user?.isAdmin && <span className="text-red-400 font-pixel text-[10px] tracking-wider ml-1">[ADMIN]</span>}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-stone-500 hover:text-red-400 text-sm transition-colors ml-1"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="bg-amber-700 hover:bg-amber-600 text-stone-900 px-4 py-1.5 text-sm font-bold transition-colors uppercase tracking-wider"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
