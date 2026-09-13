import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/stats", requireAdmin, asyncHandler(getDashboardStats));

export default router;
