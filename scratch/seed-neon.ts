import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log("Seeding Owner user to Neon Cloud PostgreSQL...");
  const owner = await prisma.users.upsert({
    where: { email: "josiecabrera@gmail.com" },
    update: {
      firebase_uid: "fawu7M5gYzfi6fXlPUPsnHrxgJk2",
      full_name: "Josie Cabrera",
      role: "OWNER",
    },
    create: {
      email: "josiecabrera@gmail.com",
      firebase_uid: "fawu7M5gYzfi6fXlPUPsnHrxgJk2",
      full_name: "Josie Cabrera",
      role: "OWNER",
    },
  });

  console.log(" OWNER SEEDED IN NEON DB SUCCESSFULLY:", owner);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
