import { Router, Request, Response } from "express";
import { registerUser, loginUser } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

interface AuthRequest extends Request {
  user?: any;
}

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/profile", authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    message: "Welcome to your profile",
    user: req.user, // No more TypeScript error here
  });
});

export default router;
