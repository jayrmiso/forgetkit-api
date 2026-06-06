import { randomUUID } from "node:crypto";

export const workspaceIdPattern = /^[0-9a-f]{32}$/;

export function generateWorkspaceId() {
  return randomUUID().replace(/-/g, "");
}
