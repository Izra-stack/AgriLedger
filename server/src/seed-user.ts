import { prisma } from './config/prisma.js';
import { firebaseAdminAuth } from './config/firebase.js';

async function main() {
  const email = process.env.OWNER_EMAIL;

  if (!email) {
    throw new Error('OWNER_EMAIL must be set before seeding the owner profile');
  }

  let firebaseUser;
  try {
    firebaseUser = await firebaseAdminAuth.getUserByEmail(email);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new Error(`Create the owner email/password account in Firebase Authentication first, then rerun this command. ${error.message}`);
    }
    throw error;
  }

  await prisma.users.upsert({
    where: { email },
    update: {
      firebase_uid: firebaseUser.uid,
      full_name: 'Josie Cabrera',
      role: 'OWNER'
    },
    create: {
      email,
      firebase_uid: firebaseUser.uid,
      full_name: 'Josie Cabrera',
      role: 'OWNER'
    }
  });

  console.log(`Owner Firebase profile seeded: ${email}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
