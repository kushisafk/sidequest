import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const project = await prisma.project.create({
    data: {
      name: body.name,
      tagline: body.tagline,
      description: body.description,
      techStack: JSON.stringify(body.techStack ?? []),
      deathTags: JSON.stringify(body.deathTags ?? []),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      epitaph: body.epitaph,
      lessons: body.lessons,
      githubUrl: body.githubUrl ?? null,
      websiteUrl: body.websiteUrl ?? null,
      authorId: session.user.id,
    },
  })

  return NextResponse.json(project, { status: 201 })
}
