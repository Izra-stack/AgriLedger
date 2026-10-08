import { DecodedIdToken } from "firebase-admin/auth";
import { prisma } from "../config/prisma.js";

export const AuthService = {
  async syncFirebaseUser(decoded: DecodedIdToken) {
    let user = await prisma.users.findUnique({
      where: { firebase_uid: decoded.uid },
      select: { id: true, email: true, firebase_uid: true, full_name: true, role: true },
    });

    if (!user && decoded.email) {
      const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
      const userEmail = decoded.email.trim().toLowerCase();

      const existingByEmail = await prisma.users.findUnique({
        where: { email: userEmail },
      });

      if (existingByEmail) {
        user = await prisma.users.update({
          where: { id: existingByEmail.id },
          data: { firebase_uid: decoded.uid },
          select: { id: true, email: true, firebase_uid: true, full_name: true, role: true },
        });
      } else if (ownerEmail && userEmail === ownerEmail) {
        user = await prisma.users.create({
          data: {
            firebase_uid: decoded.uid,
            email: userEmail,
            full_name: decoded.name || decoded.email.split("@")[0] || "Owner",
            role: "OWNER",
          },
          select: { id: true, email: true, firebase_uid: true, full_name: true, role: true },
        });
      }
    }

    if (!user) {
      throw new Error("Forbidden: no AgriLedger owner profile is linked to this Firebase account");
    }

    return { user };
  },
};
