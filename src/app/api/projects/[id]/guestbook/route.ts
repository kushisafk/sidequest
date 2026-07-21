import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { message, authorName } = await req.json()

  const entry = await prisma.guestbook.create({
    data: {
      message,
      authorName,
      projectId: id,
      authorId: session.user.id,
    },
  })

  return NextResponse.json(entry, { status: 201 })
}
