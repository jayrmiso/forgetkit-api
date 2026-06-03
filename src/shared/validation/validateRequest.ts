import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/AppError";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

type ValidationIssue = {
  path: Array<string | number>;
  message: string;
  code: string;
};

function normalizeValidationError(error: unknown): ValidationIssue[] {
  if (typeof error === "object" && error !== null && "issues" in error && Array.isArray((error as { issues: unknown }).issues)) {
    return (error as { issues: Array<{ path?: unknown[]; message?: unknown; code?: unknown }> }).issues.map((issue) => ({
      path: Array.isArray(issue.path) ? issue.path.filter((part): part is string | number => typeof part === "string" || typeof part === "number") : [],
      message: typeof issue.message === "string" ? issue.message : "Invalid value",
      code: typeof issue.code === "string" ? issue.code : "invalid_value",
    }));
  }

  return [{ path: [], message: "Invalid request", code: "invalid_request" }];
}

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params) as Record<string, string>;
      if (schemas.query) req.query = schemas.query.parse(req.query) as Request["query"];
      next();
    } catch (error) {
      next(new AppError("VALIDATION_ERROR", "Request validation failed", 400, normalizeValidationError(error)));
    }
  };
}
