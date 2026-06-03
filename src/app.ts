import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";

import { prisma } from "./database/prismaClient";
import swaggerRoutes from "./docs/swaggerRoutes";
import { errorHandler } from "./http/middleware/errorHandler";
import { sendError } from "./http/responses/sendError";
import { sendSuccess } from "./http/responses/sendSuccess";
import authRoutes from "./modules/auth/authRoutes";
import profileRoutes from "./modules/profiles/profileRoutes";
import workspaceRoutes from "./modules/workspaces/workspaceRoutes";

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ service: "forgetkit-api", status: "ok" });
});

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    sendSuccess(res, { service: "forgetkit-api", status: "ok", database: "ok" });
  } catch {
    sendError(res, 503, "DATABASE_UNAVAILABLE", "Database is unavailable");
  }
});

app.use(swaggerRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1", profileRoutes);
app.use("/v1/workspaces", workspaceRoutes);

app.use(errorHandler);

export default app;
