import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProductsAdmin,
  getProductByIdAdmin,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", asyncHandler(getProducts));
router.get("/admin/all", requireAdmin, asyncHandler(getAllProductsAdmin));
router.get("/admin/:id", requireAdmin, asyncHandler(getProductByIdAdmin));
router.get("/:slug", asyncHandler(getProductBySlug));
router.post("/", requireAdmin, asyncHandler(createProduct));
router.put("/:id", requireAdmin, asyncHandler(updateProduct));
router.delete("/:id", requireAdmin, asyncHandler(deleteProduct));

export default router;
