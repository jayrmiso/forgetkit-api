import { Router } from "express";
import { requireAuth } from "../../http/middleware/requireAuth";
import { validateRequest } from "../../shared/validation/validateRequest";
import { search } from "./searchController";
import { searchQuerySchema } from "./searchSchemas";

const router = Router();

router.get("/search", requireAuth, validateRequest({ query: searchQuerySchema }), search);

export default router;
