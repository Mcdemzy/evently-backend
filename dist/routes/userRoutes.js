"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", userController_1.registerUser);
router.post("/login", userController_1.loginUser);
// Protected route
router.get("/profile", authMiddleware_1.authMiddleware, (req, res) => {
    res.json({
        message: "Welcome to your profile",
        user: req.user, 
    });
});
exports.default = router;
