import { prisma } from './config/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  await prisma.users.upsert({
    where: { email: 'admin@agriledger.com' },
    update: {
      password_hash: passwordHash
    },
    create: {
      email: 'admin@agriledger.com',
      password_hash: passwordHash,
      full_name: 'Admin User',
      role: 'OWNER'
    }
  });

  console.log('Admin user seeded: admin@agriledger.com / password123');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
