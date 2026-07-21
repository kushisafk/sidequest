"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function GuestbookForm({
  projectId,
  authorName,
}: {
  projectId: string
  authorName: string
}) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)

    try {
      const res = await fetch(`/api/projects/${projectId}/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, authorName }),
      })
      if (res.ok) {
        setMessage("")
        router.refresh()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Rest in peace..."
        className="flex-1 bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none text-base"
        maxLength={500}
      />
      <button
        type="submit"
        disabled={submitting || !message.trim()}
        className="font-mono text-base bg-amber-700 hover:bg-amber-600 disabled:bg-stone-700 disabled:text-stone-500 text-stone-900 px-4 py-2 transition-colors"
      >
        {submitting ? "..." : "Sign"}
      </button>
    </form>
  )
}
