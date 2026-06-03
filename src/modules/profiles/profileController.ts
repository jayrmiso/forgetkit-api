import type { RequestHandler } from "express";
import { AppError } from "../../shared/errors/AppError";
import { sendSuccess } from "../../http/responses/sendSuccess";
import { ProfileService } from "./profileService";

const profileService = new ProfileService();

export const getCurrentProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw new AppError("UNAUTHORIZED", "Missing auth context", 401);
    const profile = await profileService.getOrCreateCurrentProfile(req.auth);
    sendSuccess(res, { profile });
  } catch (error) {
    next(error);
  }
};
