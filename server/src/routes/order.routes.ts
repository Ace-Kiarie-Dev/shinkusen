import { Router } from "express";
import {
  createOrder,
  getAllOrdersAdmin,
  trackOrder,
  updateOrderStatus,
} from "../controllers/order.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.post("/", asyncHandler(createOrder));
router.get("/track", asyncHandler(trackOrder));
router.get("/", requireAdmin, asyncHandler(getAllOrdersAdmin));
router.put("/:id", requireAdmin, asyncHandler(updateOrderStatus));

export default router;
