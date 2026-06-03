import type { Response } from "express";

export function sendError(res: Response, statusCode: number, code: string, message: string, details?: unknown): void {
  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  });
}
