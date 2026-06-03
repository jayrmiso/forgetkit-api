import { Router } from "express";
import { requireAuth } from "../../http/middleware/requireAuth";
import { getCurrentUserProfile } from "./userProfileController";

const router = Router();

router.get("/me", requireAuth, getCurrentUserProfile);

export default router;
