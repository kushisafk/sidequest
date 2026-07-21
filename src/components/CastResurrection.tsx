"use client"

import { useState, useCallback } from "react"

const PARTICLE_COUNT = 24

const PARTICLE_STYLES = [
  { char: "✦", color: "#fbbf24", size: "text-xs" },
  { char: "✧", color: "#f59e0b", size: "text-sm" },
  { char: "★", color: "#fff", size: "text-base" },
  { char: "♦", color: "#34d399", size: "text-sm" },
  { char: "❖", color: "#a78bfa", size: "text-base" },
  { char: "⚡", color: "#fde68a", size: "text-lg" },
]

export function CastResurrection({ children }: { children: React.ReactNode }) {
  const [casting, setCasting] = useState(false)
  const [resurrected, setResurrected] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; char: string; color: string; size: string; angle: number; distance: number; scaleEnd: number }[]>([])
  const [flash, setFlash] = useState(false)

  const cast = useCallback(() => {
    if (casting || resurrected) return
    setCasting(true)

    const centerX = 50
    const centerY = 50

    const newParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: centerX,
      y: centerY,
      ...PARTICLE_STYLES[i % PARTICLE_STYLES.length],
      angle: (360 / PARTICLE_COUNT) * i + Math.random() * 20,
      distance: 30 + Math.random() * 60,
      scaleEnd: 0.3 + Math.random() * 0.7,
    }))
    setParticles(newParticles)

    setTimeout(() => setFlash(true), 400)
    setTimeout(() => setFlash(false), 800)
    setTimeout(() => {
      setParticles([])
      setCasting(false)
      setResurrected(true)
    }, 1200)
  }, [casting, resurrected])

  return (
    <div className="relative">
      <div className={`transition-all duration-700 ${resurrected ? "ring-2 ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]" : ""}`}>
        {children}
      </div>

      {flash && (
        <div className="absolute inset-0 z-50 pointer-events-none animate-flash" />
      )}

      {particles.map((p) => {
        const radians = (p.angle * Math.PI) / 180
        const dx = Math.cos(radians) * p.distance
        const dy = Math.sin(radians) * p.distance
        return (
          <div
            key={p.id}
            className={`absolute z-40 pointer-events-none animate-particle ${p.size}`}
            style={{
              color: p.color,
              left: `${p.x}%`,
              top: `${p.y}%`,
              "--dx": `${dx}px`,
              "--dy": `${dy}px`,
              "--scale-end": p.scaleEnd,
            } as React.CSSProperties}
          >
            {p.char}
          </div>
        )
      })}

      <div className="text-center mt-4">
        {!resurrected ? (
          <button
            onClick={cast}
            disabled={casting}
            className="font-pixel text-xs bg-amber-700 hover:bg-amber-600 disabled:bg-stone-700 disabled:text-stone-500 text-stone-900 px-4 py-2 transition-colors uppercase tracking-wider"
          >
            {casting ? "⚡ Casting..." : "🔮 Cast Resurrection"}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">✨</span>
            <span className="font-pixel text-xs text-amber-400 animate-pulse">
              RESURRECTED
            </span>
            <span className="text-lg">✨</span>
          </div>
        )}
      </div>
    </div>
  )
}
