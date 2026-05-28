import { Router } from "express";

const router = Router();

/* GET home page. */
router.get("/", (_req, res) => {
  res.json({ service: "forgetkit-api", status: "ok" });
});

export default router;
