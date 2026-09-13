import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", asyncHandler(getSettings));
router.put("/", requireAdmin, asyncHandler(updateSettings));

export default router;
