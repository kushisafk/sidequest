"use client"

import { useEffect, useState } from "react"

type Star = {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
  color: string
  char: string
}

type Asteroid = {
  id: number
  left: number
  top: number
  size: number
  duration: number
  delay: number
  driftX: number
  driftY: number
  rotation: number
}

type ShootingAsteroid = {
  id: number
  left: number
  top: number
  size: number
  hasFire: boolean
  speed: number
  tx: number
  ty: number
  rotation: number
}

const COLORS = ["#fbbf24", "#34d399", "#a78bfa", "#f472b6", "#fde68a", "#fff"]
const CHARS = ["✦", "✧", "⋆", "∘", "•"]

function generateStars(): Star[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: 2 + Math.random() * 96,
    top: 5 + Math.random() * 70,
    size: 0.6 + Math.random() * 0.8,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 3,
    color: COLORS[i % COLORS.length],
    char: CHARS[i % CHARS.length],
  }))
}

function generateAsteroids(): Asteroid[] {
  return Array.from({ length: 4 }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 85,
    top: 10 + Math.random() * 60,
    size: 22 + Math.random() * 36,
    duration: 15 + Math.random() * 18,
    delay: 0,
    driftX: -40 + Math.random() * 80,
    driftY: -25 + Math.random() * 50,
    rotation: Math.floor(Math.random() * 360),
  }))
}

function generateShootingAsteroid(): ShootingAsteroid {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200
  const margin = 60

  const left = -margin
  const top = 5 + Math.random() * 75
  const tx = vw + margin * 2
  const ty = -30 + Math.random() * 60

  const hasFire = Math.random() > 0.4
  return {
    id: Date.now() + Math.random(),
    left,
    top,
    size: 22 + Math.random() * 22,
    hasFire,
    speed: 2.5 + Math.random() * 2.5,
    tx,
    ty,
    rotation: -30 + Math.random() * 60,
  }
}

export function RetroBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [shootingActive, setShootingActive] = useState<number | null>(null)
  const [shootingKey, setShootingKey] = useState(0)
  const [shootingAst, setShootingAst] = useState<ShootingAsteroid | null>(null)
  const [shower, setShower] = useState<ShootingAsteroid[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true)
      setStars(generateStars())
      setAsteroids(generateAsteroids())
    })

    const timers: ReturnType<typeof setTimeout>[] = []

    for (let i = 0; i < 3; i++) {
      const triggerStar = () => {
        setShootingActive(i)
        setShootingKey((k) => k + 1)
        setTimeout(() => setShootingActive(null), 2000)
      }
      timers.push(setTimeout(triggerStar, 5000 + i * 8000))
      const starInterval = setInterval(() => {
        triggerStar()
      }, 25000 + Math.random() * 10000)
      timers.push(starInterval)
    }

    const scheduleAsteroid = () => {
      const delay = 8000 + Math.random() * 15000
      timers.push(setTimeout(() => {
        const ast = generateShootingAsteroid()
        setShootingAst(ast)
        setTimeout(() => setShootingAst(null), ast.speed * 1000 + 500)
        scheduleAsteroid()
      }, delay))
    }
    scheduleAsteroid()

    const scheduleShower = () => {
      const delay = 60000 + Math.random() * 90000
      timers.push(setTimeout(() => {
        if (Math.random() < 0.15) {
          const count = 10 + Math.floor(Math.random() * 8)
          const batch: ShootingAsteroid[] = []
          for (let i = 0; i < count; i++) {
            timers.push(setTimeout(() => {
              const a = generateShootingAsteroid()
              a.hasFire = Math.random() < 0.8
              a.speed = 1.5 + Math.random() * 1.5
              batch.push(a)
              setShower([...batch])
            }, 50 + Math.random() * 150))
          }
          const cleanup = setTimeout(() => {
            setShower([])
          }, count * 200 + 5000)
          timers.push(cleanup)
        }
        scheduleShower()
      }, delay))
    }
    scheduleShower()

    return () => {
      cancelAnimationFrame(id)
      timers.forEach((t) => { clearTimeout(t); clearInterval(t) })
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-float-star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            fontSize: `${star.size}rem`,
            color: star.color,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: 0.3,
          }}
        >
          {star.char}
        </div>
      ))}

      {shootingActive !== null && (
        <div
          key={shootingKey}
          className="absolute text-2xl animate-shooting-star z-[1]"
          style={{
            top: `${10 + (shootingActive % 2 === 0 ? 0 : 15) + shootingActive * 5}%`,
            left: "-5%",
            color: "#fde68a",
            textShadow: "0 0 8px #fbbf24, 0 0 16px #f59e0b",
          }}
        >
          ★
        </div>
      )}

      {asteroids.map((a) => (
        <div
          key={a.id}
          className="absolute animate-asteroid z-[1]"
          style={{
            left: `${a.left}%`,
            top: `${a.top}%`,
            width: `${a.size}px`,
            height: `${a.size}px`,
            animationDuration: `${a.duration}s`,
            animationDelay: `${a.delay}s`,
            "--drift-x": `${a.driftX}px`,
            "--drift-y": `${a.driftY}px`,
            "--rot": `${a.rotation}deg`,
          } as React.CSSProperties}
        >
          <div
            className="w-full h-full"
            style={{ transform: `rotate(${a.rotation}deg)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/asteroid.png"
              alt=""
              className="w-full h-full"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>
      ))}

      {[...(shootingAst ? [shootingAst] : []), ...shower].map((ast) => (
        <div
          key={ast.id}
          className="absolute animate-shooting-asteroid z-[2]"
          style={{
            left: `${ast.left}px`,
            top: `${ast.top}%`,
            width: `${ast.size}px`,
            height: `${ast.size}px`,
            animationDuration: `${ast.speed}s`,
            "--tx": `${ast.tx}px`,
            "--ty": `${ast.ty}px`,
            "--rot": `${ast.rotation}deg`,
          } as React.CSSProperties}
        >
          {ast.hasFire && (
            <div
              className="absolute"
              style={{
                left: "50%",
                bottom: "50%",
                width: `${ast.size * 3}px`,
                height: `${ast.size * 0.3}px`,
                transformOrigin: "right center",
                transform: `translate(-100%, 50%) rotate(${Math.atan2(ast.ty, ast.tx) * (180 / Math.PI)}deg)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-yellow-300 rounded-full blur-md opacity-80 animate-flicker" />
              <div className="absolute right-1/4 bottom-1/4 w-1/3 h-1/2 bg-white rounded-full blur-sm opacity-60 animate-flicker-delayed" />
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/asteroid.png"
            alt=""
            className="w-full h-full relative z-[1]"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end overflow-hidden">
        <div className="animate-walk-char text-2xl select-none" style={{ color: "#34d399", textShadow: "0 0 4px rgba(52,211,153,0.3)" }}>
          @
        </div>
      </div>
    </div>
  )
}
