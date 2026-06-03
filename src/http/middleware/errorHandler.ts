import type { ErrorRequestHandler } from "express";
import { isAppError } from "../../shared/errors/AppError";
import { sendError } from "../responses/sendError";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isAppError(error)) {
    sendError(res, error.statusCode, error.code, error.message, error.details);
    return;
  }

  console.error(error);
  sendError(res, 500, "INTERNAL_SERVER_ERROR", "Unexpected server error");
};
