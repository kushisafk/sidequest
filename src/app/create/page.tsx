"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const INITIAL_FORM = {
  name: "",
  tagline: "",
  description: "",
  epitaph: "",
  lessons: "",
  techStack: "",
  deathTags: [] as string[],
  startDate: "",
  endDate: "",
  githubUrl: "",
  websiteUrl: "",
}

const DEATH_TAGS = [
  "burnout",
  "scope-creep",
  "no-market",
  "lost-interest",
  "over-engineered",
  "ran-out-of-time",
  "team-drama",
  "tech-debt",
  "bad-timing",
  "money",
]

export default function CreatePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (!session) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="font-pixel text-sm text-stone-400 mb-4">
          You must sign in to bury a project.
        </p>
      </div>
    )
  }

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      deathTags: f.deathTags.includes(tag)
        ? f.deathTags.filter((t) => t !== tag)
        : [...f.deathTags, tag],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const techStack = form.techStack.split(",").map((s) => s.trim()).filter(Boolean)

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, techStack }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Failed to create")
      }
      const project = await res.json()
      router.push(`/projects/${project.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-pixel text-xl text-amber-400 mb-2 text-center">CREATE A MEMORIAL</h1>
      <p className="font-mono text-xl text-stone-400 text-center mb-8">
        Lay your failed project to rest
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-mono text-base text-stone-300 block mb-1">Project Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none"
            placeholder="My Amazing Project"
          />
        </div>

        <div>
          <label className="font-mono text-base text-stone-300 block mb-1">Tagline *</label>
          <input
            required
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none"
            placeholder="A short one-liner about your project"
          />
        </div>

        <div>
          <label className="font-mono text-base text-stone-300 block mb-1">Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none resize-none"
            placeholder="What was your project about?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-base text-stone-300 block mb-1">Start Date *</label>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-base text-stone-300 block mb-1">End Date *</label>
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="font-mono text-base text-stone-300 block mb-1">Epitaph *</label>
          <input
            required
            maxLength={200}
            value={form.epitaph}
            onChange={(e) => setForm({ ...form, epitaph: e.target.value })}
            className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none"
            placeholder="Here lies a project that tried its best..."
          />
        </div>

        <div>
          <label className="font-mono text-base text-stone-300 block mb-1">Lessons Learned *</label>
          <textarea
            required
            rows={3}
            value={form.lessons}
            onChange={(e) => setForm({ ...form, lessons: e.target.value })}
            className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none resize-none"
            placeholder="What would you do differently?"
          />
        </div>

        <div>
          <label className="font-mono text-base text-stone-300 block mb-1">
            Tech Stack <span className="text-stone-500">(comma separated)</span>
          </label>
          <input
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none"
            placeholder="React, Node, PostgreSQL..."
          />
        </div>

        <div>
          <label className="font-mono text-base text-stone-300 block mb-2">Cause of Death *</label>
          <div className="flex flex-wrap gap-2">
            {DEATH_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`font-mono text-sm px-3 py-1.5 border transition-colors ${
                  form.deathTags.includes(tag)
                    ? "bg-amber-700 border-amber-500 text-stone-900"
                    : "bg-stone-800 border-stone-600 text-stone-300 hover:border-amber-500"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-base text-stone-300 block mb-1">
              GitHub URL <span className="text-stone-500">(optional)</span>
            </label>
            <input
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none"
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="font-mono text-base text-stone-300 block mb-1">
              Website <span className="text-stone-500">(optional)</span>
            </label>
            <input
              value={form.websiteUrl}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              className="w-full bg-stone-800 border border-stone-600 px-3 py-2 font-mono text-stone-200 focus:border-amber-500 outline-none"
              placeholder="https://..."
            />
          </div>
        </div>

        {error && (
          <p className="font-mono text-base text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || form.deathTags.length === 0}
          className="w-full font-pixel text-sm bg-amber-700 hover:bg-amber-600 disabled:bg-stone-700 disabled:text-stone-500 text-stone-900 px-6 py-4 transition-colors uppercase tracking-wider"
        >
          {submitting ? "Burying..." : "Bury Project"}
        </button>
      </form>
    </div>
  )
}
