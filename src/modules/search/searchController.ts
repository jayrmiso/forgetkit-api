import type { RequestHandler } from "express";
import { prisma } from "../../database/prismaClient";
import { AppError } from "../../shared/errors/AppError";
import { sendSuccess } from "../../http/responses/sendSuccess";
import { SearchRepository } from "./searchRepository";
import type { SearchQuery } from "./searchSchemas";
import { SearchService } from "./searchService";

const searchService = new SearchService(new SearchRepository(prisma));

export const search: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw new AppError("UNAUTHORIZED", "Missing auth context", 401);

    const results = await searchService.search(req.query as SearchQuery);
    sendSuccess(res, { results });
  } catch (error) {
    next(error);
  }
};
