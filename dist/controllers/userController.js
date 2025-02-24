"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOTP = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const email_1 = require("../utils/email");
const crypto_1 = __importDefault(require("crypto"));
const handleResponse = (res, status, message, data) => {
    res.status(status).json(Object.assign({ message }, data));
};
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        if (!firstName || !lastName || !username || !email || !password) {
            handleResponse(res, 400, "All fields are required.");
            return;
        }
        // Check for existing email
        const existingEmail = yield userModel_1.default.findOne({ email });
        if (existingEmail) {
            handleResponse(res, 400, "Email is already in use. Please try another one.");
            return;
        }
        // Check for existing username
        const existingUsername = yield userModel_1.default.findOne({ username });
        if (existingUsername) {
            handleResponse(res, 400, "Username is already taken. Please choose a different one.");
            return;
        }
        // Hash password securely
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.default({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });
        yield newUser.save();
        handleResponse(res, 201, "User registered successfully.");
    }
    catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            handleResponse(res, 400, `${duplicateField} already exists. Please use a different one.`);
        }
        else {
            console.error("Error registering user:", error);
            next(error);
        }
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate input fields
        if (!email || !password) {
            handleResponse(res, 400, "Email and password are required.");
            return;
        }
        // Check if user exists
        const user = yield userModel_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            handleResponse(res, 400, "Invalid email or password.");
            return;
        }
        // Validate password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            handleResponse(res, 400, "Invalid email or password.");
            return;
        }
        // Generate JWT token for authentication
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        handleResponse(res, 200, "Login successful.", {
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        next(error);
    }
});
exports.loginUser = loginUser;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            handleResponse(res, 404, "User not found.");
            return;
        }
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        yield user.save();
        const subject = "Password Reset OTP";
        const text = `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`;
        yield (0, email_1.sendEmail)(user.email, subject, text);
        handleResponse(res, 200, "OTP sent to your email.");
    }
    catch (error) {
        console.error("Error in forgotPassword:", error);
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            handleResponse(res, 404, "User not found.");
            return;
        }
        // Check if OTP matches and is not expired
        if (user.resetPasswordOTP !== otp ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < Date.now()) {
            handleResponse(res, 400, "Invalid or expired OTP.");
            return;
        }
        // If OTP is valid, respond with success
        handleResponse(res, 200, "OTP verified successfully.");
    }
    catch (error) {
        console.error("Error in verifyOTP:", error);
        next(error);
    }
});
exports.verifyOTP = verifyOTP;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            handleResponse(res, 404, "User not found.");
            return;
        }
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        // Update the user's password and clear the OTP fields
        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        handleResponse(res, 200, "Password reset successfully.");
    }
    catch (error) {
        console.error("Error in resetPassword:", error);
        next(error);
    }
});
exports.resetPassword = resetPassword;
