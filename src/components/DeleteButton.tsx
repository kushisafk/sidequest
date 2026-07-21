"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? "Failed to delete")
        setDeleting(false)
        return
      }
      router.push("/?deleted=1")
    } catch {
      alert("Something went wrong")
      setDeleting(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 mt-4 justify-center">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="font-mono text-sm bg-red-900 border border-red-700 text-red-300 px-3 py-1.5 hover:bg-red-800 transition-colors"
        >
          {deleting ? "ERASING..." : "CONFIRM DELETE"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="font-mono text-sm text-stone-400 hover:text-stone-300 px-3 py-1.5"
        >
          CANCEL
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => setConfirming(true)}
        className="font-mono text-sm text-red-700 hover:text-red-500 underline transition-colors"
      >
        Remove grave
      </button>
    </div>
  )
}
