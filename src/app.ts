import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";

const app = express();

// Enable trust proxy
app.set("trust proxy", 1);

// Log incoming origins for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Incoming Origin:", req.headers.origin);
  next();
});

// Configure CORS
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://evently-ems.vercel.app", // Deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Logging middleware
app.use(morgan("dev"));

// Body parser
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Evently Backend API is running 🚀" });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
