"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", userController_1.registerUser);
router.post("/login", userController_1.loginUser);
router.get("/me", userController_1.getCurrentUser);
router.put("/users/:id", userController_1.updateUser);
router.post("/forgot-password", userController_1.forgotPassword);
router.post("/verify-otp", userController_1.verifyOTP);
router.post("/reset-password", userController_1.resetPassword);
exports.default = router;
