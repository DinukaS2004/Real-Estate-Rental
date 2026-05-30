import path from "path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, ".env") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in your .env file");
}

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    url: databaseUrl,
    seed: "tsx prisma/seed.ts",
  },
});