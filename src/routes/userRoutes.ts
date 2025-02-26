import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
  getCurrentUser,
} from "../controllers/userController";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getCurrentUser); // Add this route
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
