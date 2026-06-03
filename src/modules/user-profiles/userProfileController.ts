import type { RequestHandler } from "express";
import { AppError } from "../../shared/errors/AppError";
import { sendSuccess } from "../../http/responses/sendSuccess";
import { UserProfileService } from "./userProfileService";

const userProfileService = new UserProfileService();

export const getCurrentUserProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw new AppError("UNAUTHORIZED", "Missing auth context", 401);
    const userProfile = await userProfileService.getOrCreateCurrentUserProfile(req.auth);
    sendSuccess(res, { profile: userProfile });
  } catch (error) {
    next(error);
  }
};
