import { prisma } from "@/lib/prisma"

export async function getProjects() {
  return prisma.project.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: { author: true, guestbooks: { include: { author: true }, orderBy: { createdAt: "desc" } } },
  })
}

export async function getProjectsByDeathTag(tag: string) {
  const all = await prisma.project.findMany({ include: { author: true } })
  return all.filter((p) => {
    try {
      const tags = JSON.parse(p.deathTags)
      return Array.isArray(tags) && tags.includes(tag)
    } catch {
      return false
    }
  })
}

export function computePartyBuild(projects: Awaited<ReturnType<typeof getProjectsByDeathTag>>) {
  if (projects.length < 3) return null

  const techCount = new Map<string, number>()
  const lessons: string[] = []

  for (const p of projects) {
    try {
      const stack = JSON.parse(p.techStack)
      if (Array.isArray(stack)) {
        for (const t of stack) {
          techCount.set(t, (techCount.get(t) ?? 0) + 1)
        }
      }
    } catch {}
    if (p.lessons) lessons.push(p.lessons)
  }

  const sortedTech = [...techCount.entries()].sort((a, b) => b[1] - a[1])
  const topTech = sortedTech.slice(0, 3).map(([t]) => t)

  const commonPitfalls: string[] = []
  for (const l of lessons) {
    const lower = l.toLowerCase()
    if (lower.includes("scope")) commonPitfalls.push("Scope creep")
    if (lower.includes("market") || lower.includes("user")) commonPitfalls.push("No market validation")
    if (lower.includes("time") || lower.includes("burnout")) commonPitfalls.push("Burnout")
    if (lower.includes("motivation") || lower.includes("interest")) commonPitfalls.push("Lost motivation")
  }
  const uniquePitfalls = [...new Set(commonPitfalls)].slice(0, 3)

  const roleSuggestions = topTech.map((tech) => {
    if (["react", "next", "vue", "angular", "svelte"].includes(tech.toLowerCase())) return "Frontend Developer"
    if (["node", "express", "fastify", "nest"].includes(tech.toLowerCase())) return "Backend Developer"
    if (["python", "django", "flask", "fastapi"].includes(tech.toLowerCase())) return "Backend Developer"
    if (["postgres", "mongodb", "mysql", "sqlite", "redis"].includes(tech.toLowerCase())) return "Database Engineer"
    if (["docker", "aws", "gcp", "azure"].includes(tech.toLowerCase())) return "DevOps Engineer"
    return "Full-Stack Developer"
  })

  return {
    suggestedRoles: [...new Set(roleSuggestions)],
    recommendedTech: topTech,
    commonPitfalls: uniquePitfalls.length > 0 ? uniquePitfalls : ["Scope creep", "Lack of users"],
    projectCount: projects.length,
    proposedTimeline: "6 weeks for MVP with " + (topTech[0] ?? "your chosen stack"),
  }
}
