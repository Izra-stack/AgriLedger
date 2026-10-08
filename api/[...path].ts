import type { NextFunction, Request, Response } from "express";

const healthResponse = (res: Response) =>
  res.status(200).json({
    success: true,
    message: "AgriLedger API is running",
    environment: process.env.NODE_ENV || "production",
  });

export default async function apiHandler(req: Request, res: Response, next: NextFunction) {
  const requestUrl = req.url || "/";
  const queryIndex = requestUrl.indexOf("?");
  const requestPath = queryIndex === -1 ? requestUrl : requestUrl.slice(0, queryIndex);
  const normalizedPath = requestPath.replace(/^\/api(?:\/|$)/, "/") || "/";

  if (normalizedPath === "/health") {
    return healthResponse(res);
  }

  const query = queryIndex === -1 ? "" : requestUrl.slice(queryIndex);
  req.url = `/api${normalizedPath}${query}`;

  const { app } = await import("../server/src/app.js");
  return app(req, res, next);
}
