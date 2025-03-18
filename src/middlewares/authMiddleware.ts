//@ts-nocheck
// your previous code starts here
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include a user property
// interface AuthRequest extends Request {
//   user?: any;
// }

// // Correct the type to `RequestHandler`
// export const authMiddleware = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const authHeader = req.header("Authorization");
//   const token = authHeader?.split(" ")[1];

//   if (!token) {
//     res.status(401).json({ message: "Access denied. No token provided." });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     req.user = decoded; // Attach decoded user to the request object
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid or expired token." });
//   }
// };
// this is your previous code
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username?: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      email: string;
      username?: string;
    };

    if (!decoded.userId || !decoded.email) {
      res.status(401).json({ message: "Invalid token structure." });
      return;
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username ?? "defaultUsername",
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
