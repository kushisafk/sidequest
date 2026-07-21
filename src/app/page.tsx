import Link from "next/link"
import { getProjects } from "@/lib/db"
import { Gravestone } from "@/components/Gravestone"
import { ThunderIntro } from "@/components/ThunderIntro"

export const dynamic = "force-dynamic"

const DEATH_TAGS = ["burnout", "scope-creep", "no-market", "lost-interest", "over-engineered", "ran-out-of-time"]

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function mostCommonTag(tags: string[][]): string {
  const counts = new Map<string, number>()
  for (const list of tags) {
    for (const t of list) {
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
  }
  let max = 0, maxTag = "none"
  for (const [tag, count] of counts) {
    if (count > max) { max = count; maxTag = tag }
  }
  return maxTag
}

export default async function HomePage() {
  const projects = await getProjects()
  const allDeathTags = projects.map((p) => {
    try { return JSON.parse(p.deathTags) as string[] } catch { return [] }
  })

  return (
    <ThunderIntro>
      <div className="min-h-full flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-8 text-center">
          <h1 className="font-pixel text-3xl md:text-4xl text-amber-400 mb-2 tracking-wider">
            SIDEQUEST
          </h1>
          <p className="font-pixel text-sm text-stone-400 mb-4 tracking-wide">
            Failed Project Graveyard
          </p>
          <p className="font-mono text-xl text-stone-300 max-w-lg mx-auto mb-8 leading-relaxed">
            A memorial for side projects that didn&apos;t make it.<br />
            Rest in peace, sweet code.
          </p>

          {projects.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 font-mono text-base text-stone-400">
              <div className="flex items-center gap-2">
                <span className="text-amber-600">⚰️</span>
                <span>{projects.length} buried</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-400">☠️</span>
                <span>Most died from <span className="text-amber-400">{mostCommonTag(allDeathTags)}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-500">🕯️</span>
                <span>Latest {timeAgo(projects[0].createdAt)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {DEATH_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="font-mono text-sm bg-stone-800/80 border border-stone-600 text-stone-300 px-3 py-1.5 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/projects"
              className="font-pixel text-xs bg-stone-800 border-2 border-amber-700 text-amber-400 hover:bg-amber-700 hover:text-stone-900 px-6 py-3 transition-colors tracking-wider"
            >
              Browse the Graveyard
            </Link>
            <Link
              href="/create"
              className="font-pixel text-xs bg-amber-700 hover:bg-amber-600 text-stone-900 px-6 py-3 transition-colors tracking-wider"
            >
              Bury a Project
            </Link>
          </div>
        </section>

        {projects.length > 0 && (
          <section className="max-w-lg mx-auto px-4 pb-12 w-full">
            <p className="font-pixel text-[10px] text-stone-500 mb-3 text-center tracking-wider">— RECENT BURIAL —</p>
            <Gravestone
              id={projects[0].id}
              name={projects[0].name}
              epitaph={projects[0].epitaph}
              deathTags={JSON.parse(projects[0].deathTags)}
              authorHandle={projects[0].author.githubHandle}
            />
          </section>
        )}

        {projects.length === 0 && (
          <section className="pb-16 text-center">
            <p className="font-pixel text-sm text-stone-500 mb-4">The graveyard is empty...</p>
            <Link
              href="/create"
              className="font-pixel text-sm bg-amber-700 hover:bg-amber-600 text-stone-900 px-6 py-3 transition-colors"
            >
              Bury Your First Project
            </Link>
          </section>
        )}
      </div>
    </ThunderIntro>
  )
}
