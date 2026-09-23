import { DecodedIdToken } from "firebase-admin/auth";
import { prisma } from "../config/prisma.js";

export const AuthService = {
  async syncFirebaseUser(decoded: DecodedIdToken) {
    const email = decoded.email?.toLowerCase();
    if (!email) throw new Error("Firebase account has no verified email");
    const existing = await prisma.users.findFirst({ where: { OR: [{ firebase_uid: decoded.uid }, { email }] } });
    const user = existing
      ? await prisma.users.update({ where: { id: existing.id }, data: { firebase_uid: decoded.uid, email, full_name: decoded.name || existing.full_name, updated_at: new Date() } })
      : await prisma.users.create({ data: { email, firebase_uid: decoded.uid, full_name: decoded.name || email, role: "STAFF" } });

    return { user };
  },
};
