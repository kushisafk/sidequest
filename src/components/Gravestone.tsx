"use client"

import Link from "next/link"

interface GravestoneProps {
  id: string
  name: string
  epitaph: string
  deathTags: string[]
  authorHandle?: string
  isPreview?: boolean
}

export function Gravestone({ id, name, epitaph, deathTags, authorHandle, isPreview }: GravestoneProps) {
  return (
    <Link
      href={isPreview ? "#" : `/projects/${id}`}
      className="block group"
    >
      <div className="bg-stone-700 border-2 border-stone-500 p-4 text-center
        hover:border-amber-400 transition-colors duration-200
        shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
      >
        <div className="text-3xl mb-2">🪦</div>
        <h3 className="font-pixel text-sm text-amber-300 mb-1 leading-tight">
          {name}
        </h3>
        <p className="font-mono text-xs text-stone-400 italic mb-2 leading-relaxed">
          &ldquo;{epitaph}&rdquo;
        </p>
        <div className="flex flex-wrap gap-1 justify-center mb-2">
          {deathTags.map((tag) => (
            <span
              key={tag}
              className="bg-stone-900 text-red-400 text-[11px] px-2 py-0.5 uppercase tracking-wider font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
        {authorHandle && (
          <p className="font-mono text-[11px] text-stone-500 border-t border-stone-600 pt-1.5 mt-1">
            by <a
              href={`https://github.com/${authorHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-stone-400 hover:text-amber-400 underline underline-offset-2 transition-colors"
            >
              @{authorHandle}
            </a>
          </p>
        )}
      </div>
    </Link>
  )
}
