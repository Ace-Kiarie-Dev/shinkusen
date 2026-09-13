import { Router } from "express";
import { mpesaCallback } from "../controllers/mpesa.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/callback", asyncHandler(mpesaCallback));

export default router;
