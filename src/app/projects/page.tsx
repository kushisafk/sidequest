import Link from "next/link"
import { getProjects } from "@/lib/db"
import { Gravestone } from "@/components/Gravestone"

export const dynamic = "force-dynamic"

export default async function BrowsePage() {
  const projects = await getProjects()

  const allTags = [
    ...new Set(
      projects.flatMap((p) => {
        try {
          return JSON.parse(p.deathTags) as string[]
        } catch {
          return []
        }
      })
    ),
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-pixel text-xl text-amber-400 mb-2">BROWSE THE GRAVEYARD</h1>
      <p className="font-mono text-xl text-stone-400 mb-6">{projects.length} projects buried here</p>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="font-mono text-sm text-stone-500 self-center mr-2">Filter by death:</span>
        {allTags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="font-mono text-sm bg-stone-800 border border-stone-600 text-stone-300 px-3 py-1.5 hover:border-amber-500 hover:text-amber-400 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-pixel text-sm text-stone-500 mb-4">
            The graveyard is empty...
          </p>
          <Link
            href="/create"
            className="inline-block font-pixel text-sm bg-amber-700 hover:bg-amber-600 text-stone-900 px-6 py-3 transition-colors"
          >
            Bury Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.map((project) => (
            <Gravestone
              key={project.id}
              id={project.id}
              name={project.name}
              epitaph={project.epitaph}
              deathTags={JSON.parse(project.deathTags)}
              authorHandle={project.author.githubHandle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
