import { Router } from "express";
import { requireAuth } from "../../http/middleware/requireAuth";
import { validateRequest } from "../../shared/validation/validateRequest";
import { createWorkspace, getWorkspace, listWorkspaces, updateWorkspace } from "./workspaceController";
import { createWorkspaceBodySchema, updateWorkspaceBodySchema, workspaceParamsSchema } from "./workspaceSchemas";

const router = Router();

router.get("/", requireAuth, listWorkspaces);
router.post("/", requireAuth, validateRequest({ body: createWorkspaceBodySchema }), createWorkspace);
router.get("/:workspaceId", requireAuth, validateRequest({ params: workspaceParamsSchema }), getWorkspace);
router.patch(
  "/:workspaceId",
  requireAuth,
  validateRequest({ params: workspaceParamsSchema, body: updateWorkspaceBodySchema }),
  updateWorkspace,
);

export default router;
