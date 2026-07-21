"use client"

import { useEffect, useState } from "react"

type Phase = "black" | "glow" | "bolt" | "flash" | "shatter" | "done"

const SHATTER_PIECES = Array.from({ length: 12 }, (_, i) => {
  const col = i % 4
  const row = Math.floor(i / 4)
  const dx = (col - 1.5) * (80 + Math.random() * 120)
  const dy = (row - 1) * (60 + Math.random() * 100)
  const rot = (Math.random() - 0.5) * 180
  return { id: i, col, row, dx, dy, rot }
})

export function ThunderIntro({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("black")

  useEffect(() => {
    if (sessionStorage.getItem("thunder-intro-seen")) {
      requestAnimationFrame(() => setPhase("done"))
      return
    }

    const t1 = setTimeout(() => setPhase("glow"), 800)
    const t2 = setTimeout(() => setPhase("bolt"), 1600)
    const t3 = setTimeout(() => setPhase("flash"), 2700)
    const t4 = setTimeout(() => setPhase("shatter"), 3200)
    const t5 = setTimeout(() => {
      sessionStorage.setItem("thunder-intro-seen", "true")
      setPhase("done")
    }, 4400)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      clearTimeout(t4); clearTimeout(t5)
    }
  }, [])

  return (
    <>
      {phase !== "done" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-none select-none">
          <span
            className={`font-pixel text-5xl md:text-7xl tracking-wider transition-all duration-1000 ${
              phase === "black"
                ? "opacity-60 scale-100 text-amber-600"
                : phase === "glow"
                  ? "opacity-80 scale-105 text-amber-400"
                  : phase === "shatter" || phase === "flash"
                    ? "opacity-0 scale-150 blur-sm"
                    : "opacity-60 scale-100 text-amber-500"
            }`}
          >
            SIDEQUEST
          </span>

          {phase === "glow" && (
            <div className="absolute inset-0 bg-amber-900/10 animate-pulse" />
          )}

          {phase === "bolt" && (
            <div className="absolute inset-0 flex items-start justify-center pt-[8%]">
              <svg
                width="130"
                height="380"
                viewBox="0 0 130 380"
                className="strike-down"
                style={{ imageRendering: "pixelated" }}
              >
                <defs>
                  <linearGradient id="boltGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fff7ed" />
                    <stop offset="15%" stopColor="#fde68a" />
                    <stop offset="40%" stopColor="#fbbf24" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <filter id="boltGlow">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fbbf24" floodOpacity="0.9" />
                    <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="#f59e0b" floodOpacity="0.6" />
                    <feDropShadow dx="0" dy="0" stdDeviation="35" floodColor="#d97706" floodOpacity="0.3" />
                  </filter>
                </defs>
                <polyline
                  points="65,10 100,45 55,90 105,135 60,180 100,225 50,275 35,370"
                  fill="none"
                  stroke="url(#boltGrad)"
                  strokeWidth="50"
                  strokeLinejoin="miter"
                  strokeLinecap="square"
                  filter="url(#boltGlow)"
                />
                <polyline
                  points="65,10 100,45 55,90 105,135 60,180 100,225 50,275 35,370"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="12"
                  strokeLinejoin="miter"
                  strokeLinecap="square"
                  opacity="0.5"
                />
              </svg>
              <div className="absolute inset-0 bg-white/10 animate-thunder-shake" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-30 animate-strike-line" />
            </div>
          )}

          {phase === "flash" && (
            <div className="absolute inset-0 bg-white animate-thunder-flash pointer-events-none" />
          )}

          {phase === "shatter" && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black animate-shatter-fade" />
              {SHATTER_PIECES.map((p) => (
                <div
                  key={p.id}
                  className="absolute bg-black animate-shatter-piece"
                  style={{
                    left: `${p.col * 25}%`,
                    top: `${p.row * 34}%`,
                    width: "25%",
                    height: "34%",
                    "--dx": `${p.dx}px`,
                    "--dy": `${p.dy}px`,
                    "--rot": `${p.rot}deg`,
                    animationDelay: `${(p.col * 4 + p.row) * 0.04}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {children}
    </>
  )
}
