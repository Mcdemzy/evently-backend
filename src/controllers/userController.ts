import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/userModel";

const handleResponse = (res: Response, status: number, message: string) => {
  return res.status(status).json({ message });
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, username, email, password, acceptedTerms } =
      req.body;

    // Validate input fields
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      acceptedTerms === undefined
    ) {
      handleResponse(
        res,
        400,
        "All fields are required, including accepting terms and conditions."
      );
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
      acceptedTerms,
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
      next(error); // Pass unexpected errors to error handler middleware
    }
  }
};
