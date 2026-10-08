import { app } from "../server/src/app.js";

// Vercel can invoke this function with the `/api` prefix already removed.
// Normalize both forms so Express always sees the same route structure.
export default function vercelHandler(req: any, res: any, next: any) {
  if (!req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }

  return app(req, res, next);
}
