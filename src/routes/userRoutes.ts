import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
  getCurrentUser,
  updateUser,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/userController";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/login", loginUser);
router.get("/me", getCurrentUser);
router.put("/users/:id", updateUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
