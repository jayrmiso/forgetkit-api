import { Router } from "express";
import { getVerificationState, resendVerification, resolveIdentifier } from "./authController";

const router = Router();

router.post("/resolve-identifier", resolveIdentifier);
router.get("/verification-status", getVerificationState);
router.post("/resend-verification", resendVerification);

export default router;
