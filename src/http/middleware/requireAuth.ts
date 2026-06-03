import type { RequestHandler } from "express";
import { AppError } from "../../shared/errors/AppError";
import { verifyAccessToken } from "../../modules/auth/authService";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const authorization = req.header("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError("UNAUTHORIZED", "Missing bearer token", 401);
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      throw new AppError("UNAUTHORIZED", "Missing bearer token", 401);
    }

    req.auth = await verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  }
};
