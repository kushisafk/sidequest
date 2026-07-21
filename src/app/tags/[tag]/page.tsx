import Link from "next/link"
import { getProjectsByDeathTag, computePartyBuild } from "@/lib/db"
import { Gravestone } from "@/components/Gravestone"
import { CastResurrection } from "@/components/CastResurrection"

export const dynamic = "force-dynamic"

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const projects = await getProjectsByDeathTag(tag)
  const partyBuild = computePartyBuild(projects)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="font-mono text-base text-stone-500 hover:text-amber-400 transition-colors mb-4 inline-block">
        ← Back to Graveyard
      </Link>

      <h1 className="font-pixel text-xl text-red-400 mb-2">
        #{tag}
      </h1>
      <p className="font-mono text-xl text-stone-400 mb-8">
        {projects.length} project{projects.length !== 1 ? "s" : ""} died this way
      </p>

      {partyBuild && (
        <div className="mb-8">
          <CastResurrection>
            <div className="border-2 border-amber-700 bg-stone-900 p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="w-full h-full bg-[linear-gradient(0deg,transparent_0%,transparent_50%,rgba(255,215,0,0.05)_50%,rgba(255,215,0,0.05)_100%)] bg-[length:100%_4px]" />
              </div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <span className="text-3xl">✨</span>
                  <h2 className="font-pixel text-sm text-amber-400 mt-2">PARTY BUILD</h2>
                  <p className="font-mono text-stone-500 text-base">
                    Auto-generated from {partyBuild.projectCount} failed projects
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="border border-stone-700 p-3">
                    <p className="font-pixel text-xs text-amber-600 mb-2">SUGGESTED ROLES</p>
                    <ul className="font-mono text-base text-stone-300 space-y-1">
                      {partyBuild.suggestedRoles.map((role) => (
                        <li key={role}>→ {role}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-stone-700 p-3">
                    <p className="font-pixel text-xs text-amber-600 mb-2">RECOMMENDED TECH</p>
                    <ul className="font-mono text-base text-stone-300 space-y-1">
                      {partyBuild.recommendedTech.map((tech) => (
                        <li key={tech}>→ {tech}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-stone-700 p-3">
                    <p className="font-pixel text-xs text-amber-600 mb-2">COMMON PITFALLS</p>
                    <ul className="font-mono text-base text-red-400 space-y-1">
                      {partyBuild.commonPitfalls.map((pitfall) => (
                        <li key={pitfall}>⚠ {pitfall}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="font-mono text-base text-stone-400">
                    Timeline: {partyBuild.proposedTimeline}
                  </p>
                </div>
              </div>
            </div>
          </CastResurrection>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-pixel text-sm text-stone-500">
            No projects with this death tag yet.
          </p>
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
