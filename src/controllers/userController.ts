import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

import { sendEmail } from "../utils/email";
import crypto from "crypto";

const handleResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any
): void => {
  res.status(status).json({ message, ...data });
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      handleResponse(res, 400, "All fields are required.");
      return;
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      handleResponse(
        res,
        400,
        "Email is already in use. Please try another one."
      );
      return;
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      handleResponse(
        res,
        400,
        "Username is already taken. Please choose a different one."
      );
      return;
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await newUser.save();

    handleResponse(res, 201, "User registered successfully.");
  } catch (error: any) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      handleResponse(
        res,
        400,
        `${duplicateField} already exists. Please use a different one.`
      );
    } else {
      console.error("Error registering user:", error);
      next(error);
    }
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      handleResponse(res, 400, "Email and password are required.");
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      handleResponse(res, 400, "Invalid email or password.");
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      handleResponse(res, 400, "Invalid email or password.");
      return;
    }

    // Generate JWT token for authentication
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

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
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      handleResponse(res, 404, "User not found.");
      return;
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const subject = "Password Reset OTP";
    const text = `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`;
    await sendEmail(user.email, subject, text);

    handleResponse(res, 200, "OTP sent to your email.");
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      handleResponse(res, 404, "User not found.");
      return;
    }

    // Check if OTP matches and is not expired
    if (
      user.resetPasswordOTP !== otp ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < Date.now()
    ) {
      handleResponse(res, 400, "Invalid or expired OTP.");
      return;
    }

    // If OTP is valid, respond with success
    handleResponse(res, 200, "OTP verified successfully.");
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      handleResponse(res, 404, "User not found.");
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the OTP fields
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    handleResponse(res, 200, "Password reset successfully.");
  } catch (error) {
    console.error("Error in resetPassword:", error);
    next(error);
  }
};
