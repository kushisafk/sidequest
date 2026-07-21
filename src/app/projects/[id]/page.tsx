import { notFound } from "next/navigation"
import { getProjectById } from "@/lib/db"
import { auth } from "@/lib/auth"
import { GuestbookForm } from "./GuestbookForm"
import { DeleteButton } from "@/components/DeleteButton"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectById(id)
  const session = await auth()

  if (!project) notFound()

  const techStack: string[] = JSON.parse(project.techStack)
  const deathTags: string[] = JSON.parse(project.deathTags)

  const start = new Date(project.startDate)
  const end = new Date(project.endDate)
  const lifespan = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="border-2 border-amber-700 bg-stone-900 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(0deg,transparent_0%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_100%)] bg-[length:100%_4px]" />
        </div>

        <div className="relative z-10 text-center mb-8">
          <p className="text-4xl mb-2">🪦</p>
          <h1 className="font-pixel text-2xl text-amber-400 mb-2">{project.name}</h1>
          <p className="font-mono text-stone-400 text-xl mb-1">{project.tagline}</p>
          <p className="font-mono text-stone-500 text-base">
            {start.toLocaleDateString()} — {end.toLocaleDateString()} ({lifespan} days)
          </p>
        </div>

        <div className="relative z-10 text-center mb-6">
          <p className="font-pixel text-sm text-amber-600 mb-2">EPITAPH</p>
          <p className="font-mono text-stone-300 text-xl italic">
            &ldquo;{project.epitaph}&rdquo;
          </p>
        </div>

        <div className="relative z-10 space-y-4 mb-8">
          <div>
              <p className="font-pixel text-sm text-amber-600 mb-2">CAUSE OF DEATH</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {deathTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="font-mono text-base bg-stone-800 border border-stone-600 text-red-400 px-3 py-1.5 hover:border-red-500 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {techStack.length > 0 && (
            <div>
              <p className="font-pixel text-sm text-amber-600 mb-2">TECH STACK</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {techStack.map((tech) => (
                  <span key={tech} className="font-mono text-base bg-stone-800 text-stone-300 px-3 py-1 border border-stone-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="font-pixel text-sm text-amber-600 mb-2">DESCRIPTION</p>
            <p className="font-mono text-stone-300">{project.description}</p>
          </div>

          <div>
            <p className="font-pixel text-sm text-amber-600 mb-2">LESSONS LEARNED</p>
            <p className="font-mono text-stone-300">{project.lessons}</p>
          </div>

          {(project.githubUrl || project.websiteUrl) && (
            <div className="flex gap-4 justify-center pt-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-base text-stone-400 hover:text-amber-400 transition-colors underline"
                >
                  GitHub
                </a>
              )}
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-stone-400 hover:text-amber-400 transition-colors underline"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>

        <div className="relative z-10 border-t border-stone-700 pt-4">
          <p className="font-mono text-sm text-stone-500 text-center">
            Created by {project.author.name ?? project.author.githubHandle}
          </p>
          {session?.user?.isAdmin && <DeleteButton projectId={project.id} />}
        </div>
      </div>

      <div className="mt-8 border border-stone-700 bg-stone-900 p-4">
        <h2 className="font-pixel text-sm text-amber-400 mb-4">GUESTBOOK</h2>

        {project.guestbooks.length === 0 ? (
          <p className="font-mono text-stone-500 text-base mb-4">No condolences yet.</p>
        ) : (
          <div className="space-y-3 mb-6">
            {project.guestbooks.map((entry) => (
              <div key={entry.id} className="border-l-2 border-stone-700 pl-3">
                <p className="font-mono text-stone-300">{entry.message}</p>
                <p className="font-mono text-sm text-stone-500 mt-1">
                  — {entry.authorName}
                </p>
              </div>
            ))}
          </div>
        )}

        {session?.user ? (
          <GuestbookForm projectId={project.id} authorName={session.user.name ?? "Anonymous"} />
        ) : (
          <p className="font-mono text-sm text-stone-500">
            Sign in to leave a message.
          </p>
        )}
      </div>
    </div>
  )
}
