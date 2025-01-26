import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

const handleResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any
) => {
  return res.status(status).json({ message, ...data });
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
