import { Router } from "express";
import { requireAuth } from "../../http/middleware/requireAuth";
import { validateRequest } from "../../shared/validation/validateRequest";
import { createWorkspace, getWorkspace, listWorkspaces } from "./workspaceController";
import { createWorkspaceBodySchema, workspaceParamsSchema } from "./workspaceSchemas";

const router = Router();

router.get("/", requireAuth, listWorkspaces);
router.post("/", requireAuth, validateRequest({ body: createWorkspaceBodySchema }), createWorkspace);
router.get("/:workspaceId", requireAuth, validateRequest({ params: workspaceParamsSchema }), getWorkspace);

export default router;
