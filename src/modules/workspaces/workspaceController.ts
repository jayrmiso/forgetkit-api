import type { RequestHandler } from "express";
import { prisma } from "../../database/prismaClient";
import { AppError } from "../../shared/errors/AppError";
import { sendSuccess } from "../../http/responses/sendSuccess";
import { WorkspaceService } from "./workspaceService";
import { WorkspaceRepository } from "./workspaceRepository";

const workspaceService = new WorkspaceService(new WorkspaceRepository(prisma));

export const createWorkspace: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw new AppError("UNAUTHORIZED", "Missing auth context", 401);
    const workspace = await workspaceService.createWorkspace(req.auth.userId, req.body);
    sendSuccess(res, { workspace }, 201);
  } catch (error) {
    next(error);
  }
};

export const listWorkspaces: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw new AppError("UNAUTHORIZED", "Missing auth context", 401);
    const workspaces = await workspaceService.listWorkspaces(req.auth.userId);
    sendSuccess(res, { workspaces });
  } catch (error) {
    next(error);
  }
};

export const getWorkspace: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw new AppError("UNAUTHORIZED", "Missing auth context", 401);
    const workspace = await workspaceService.getWorkspace(req.auth.userId, String(req.params.workspaceId));
    sendSuccess(res, { workspace });
  } catch (error) {
    next(error);
  }
};
