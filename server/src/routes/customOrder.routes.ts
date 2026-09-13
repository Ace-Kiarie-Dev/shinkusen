import { Router } from "express";
import {
  createCustomOrder,
  getAllCustomOrdersAdmin,
  updateCustomOrderStatus,
} from "../controllers/customOrder.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.post("/", asyncHandler(createCustomOrder));
router.get("/", requireAdmin, asyncHandler(getAllCustomOrdersAdmin));
router.put("/:id", requireAdmin, asyncHandler(updateCustomOrderStatus));

export default router;
