import { DecodedIdToken } from "firebase-admin/auth";
import { prisma } from "../config/prisma.js";

export const AuthService = {
  async syncFirebaseUser(decoded: DecodedIdToken) {
    let user = await prisma.users.findUnique({
      where: { firebase_uid: decoded.uid },
      select: { id: true, email: true, firebase_uid: true, full_name: true, role: true },
    });

    if (!user && decoded.email) {
      const existingByEmail = await prisma.users.findUnique({
        where: { email: decoded.email },
      });

      if (existingByEmail) {
        user = await prisma.users.update({
          where: { id: existingByEmail.id },
          data: { firebase_uid: decoded.uid },
          select: { id: true, email: true, firebase_uid: true, full_name: true, role: true },
        });
      } else {
        user = await prisma.users.create({
          data: {
            firebase_uid: decoded.uid,
            email: decoded.email,
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
