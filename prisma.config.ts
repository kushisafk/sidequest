import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"] ?? "postgresql://postgres.gxgssfyaqsczljtbpaqb:kushal%402486@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres",
  },
});
