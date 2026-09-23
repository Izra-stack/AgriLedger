import { NextFunction, Request, Response } from "express";
import { firebaseAdminAuth } from "../config/firebase.js";
import { prisma } from "../config/prisma.js";

// Extend Request interface to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized: No token provided" });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  // email valid
  try {
    const decoded = await firebaseAdminAuth.verifyIdToken(token);
    const user = await prisma.users.findUnique({
      where: { firebase_uid: decoded.uid },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(403).json({ success: false, error: "Forbidden: Owner profile not found" });
    }

    req.user = user;
    next();
  } catch {
    return res
      .status(403)
      .json({ success: false, error: "Forbidden: Invalid or expired token" });
  }
};

export const requireRole = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: "Forbidden: insufficient role" });
  }
  next();
};
