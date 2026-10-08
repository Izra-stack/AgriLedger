import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function run() {
  const users = await prisma.users.findMany();
  console.log("USERS IN DB:", JSON.stringify(users, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
