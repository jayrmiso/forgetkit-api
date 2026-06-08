import { randomUUID } from "node:crypto";

export const workspaceIdPattern = /^[0-9a-f]{32}$|^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function generateWorkspaceId() {
  return randomUUID().replace(/-/g, "");
}

export function normalizeWorkspaceId(workspaceId: string) {
  return workspaceId.replace(/-/g, "").toLowerCase();
}
