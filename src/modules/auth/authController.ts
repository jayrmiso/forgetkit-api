import type { RequestHandler } from "express";
import { sendSuccess } from "../../http/responses/sendSuccess";
import { authEmailSchema, authIdentifierSchema } from "./authSchemas";
import { getVerificationStatus, resendVerificationEmail, resolveAuthIdentifier } from "./authService";

export const resolveIdentifier: RequestHandler = async (req, res, next) => {
  try {
    const { identifier } = authIdentifierSchema.parse(req.body);
    const user = await resolveAuthIdentifier(identifier);
    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
};

export const getVerificationState: RequestHandler = async (req, res, next) => {
  try {
    const { email } = authEmailSchema.parse(req.query);
    const verification = await getVerificationStatus(email);
    sendSuccess(res, { verification });
  } catch (error) {
    next(error);
  }
};

export const resendVerification: RequestHandler = async (req, res, next) => {
  try {
    const { email } = authEmailSchema.parse(req.body);
    const result = await resendVerificationEmail(email);
    sendSuccess(res, { verification: result }, 201);
  } catch (error) {
    next(error);
  }
};
