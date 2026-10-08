import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

if (!getApps().length) {
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin configuration is incomplete");
  }

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const firebaseAdminAuth = getAuth();
