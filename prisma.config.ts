import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "postgresql://postgres:kushal%402486@db.gxgssfyaqsczljtbpaqb.supabase.co:5432/postgres",
  },
});
