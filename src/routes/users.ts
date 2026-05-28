import { Router } from "express";

const router = Router();

/* GET users listing. */
router.get("/", (_req, res) => {
  res.json({ users: [] });
});

export default router;
