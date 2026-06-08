import type { RequestHandler } from "express";
import { prisma } from "../../database/prismaClient";
import { AppError } from "../../shared/errors/AppError";
import { sendSuccess } from "../../http/responses/sendSuccess";
import { UserProfileService } from "../user-profiles/userProfileService";
import { WorkspaceService } from "./workspaceService";
import { WorkspaceRepository } from "./workspaceRepository";

const workspaceService = new WorkspaceService(new WorkspaceRepository(prisma));
const userProfileService = new UserProfileService();

async function getSyncedUserProfileId(req: Parameters<RequestHandler>[0]) {
  if (!req.auth) throw new AppError("UNAUTHORIZED", "Missing auth context", 401);
  const userProfile = await userProfileService.getOrCreateCurrentUserProfile(req.auth);
  return userProfile.id;
}

export const createWorkspace: RequestHandler = async (req, res, next) => {
  try {
    const userProfileId = await getSyncedUserProfileId(req);
    const workspace = await workspaceService.createWorkspace(userProfileId, req.body);
    sendSuccess(res, { workspace }, 201);
  } catch (error) {
    next(error);
  }
};

export const listWorkspaces: RequestHandler = async (req, res, next) => {
  try {
    const userProfileId = await getSyncedUserProfileId(req);
    const workspaces = await workspaceService.listWorkspaces(userProfileId);
    sendSuccess(res, { workspaces });
  } catch (error) {
    next(error);
  }
};

export const getWorkspace: RequestHandler = async (req, res, next) => {
  try {
    const userProfileId = await getSyncedUserProfileId(req);
    const workspace = await workspaceService.getWorkspace(userProfileId, String(req.params.workspaceId));
    sendSuccess(res, { workspace });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace: RequestHandler = async (req, res, next) => {
  try {
    const userProfileId = await getSyncedUserProfileId(req);
    const workspace = await workspaceService.updateWorkspace(userProfileId, String(req.params.workspaceId), req.body);
    sendSuccess(res, { workspace });
  } catch (error) {
    next(error);
  }
};
