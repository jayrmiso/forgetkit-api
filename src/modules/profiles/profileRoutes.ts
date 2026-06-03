import { Router } from "express";
import { requireAuth } from "../../http/middleware/requireAuth";
import { getCurrentProfile } from "./profileController";

const router = Router();

router.get("/me", requireAuth, getCurrentProfile);

export default router;
