import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max, message = "Too many requests, please try again later." } = options;
  const hits = new Map<string, ClientRecord>();

  // Periodically clean up expired entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref?.();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
    const now = Date.now();
    const record = hits.get(clientIp);

    if (!record || now > record.resetTime) {
      hits.set(clientIp, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: message,
      });
    }

    next();
  };
}

export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 attempts per minute
  message: "Too many authentication requests. Please try again in a minute.",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per 15 minutes
  message: "Rate limit exceeded. Please try again later.",
});
