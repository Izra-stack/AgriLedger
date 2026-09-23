import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled API error", err);
  
  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
};
