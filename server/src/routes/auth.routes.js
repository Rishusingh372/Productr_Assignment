import { Router } from "express";
import { requestOtp, verifyOtp, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", requireAuth, me);

export default router;
