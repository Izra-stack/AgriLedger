import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:ixbp@localhost:5432/agriledger?schema=public";

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function run() {
  console.log("Checking DB Connection & Models...");
  const users = await prisma.users.findMany();
  console.log("Users:", users.length);

  const farmers = await prisma.farmers.findMany();
  console.log("Farmers:", farmers.length);

  const inventory = await prisma.inventory_items.findMany();
  console.log("Inventory Items:", inventory.length);

  const transactions = await prisma.transactions.findMany();
  console.log("Transactions:", transactions.length);

  const payments = await prisma.payments.findMany();
  console.log("Payments:", payments.length);

  const movements = await prisma.inventory_movements.findMany();
  console.log("Movements:", movements.length);

  const items = await prisma.transaction_items.findMany();
  console.log("Transaction Items:", items.length);

  console.log("ALL PRISMA MODELS ACCESSIBLE SUCCESSFULLY!");
}

run().catch(console.error).finally(() => prisma.$disconnect());
