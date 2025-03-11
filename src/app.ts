import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";

const app = express();

// ✅ Enable trust proxy (Fixes rate-limit issue)
app.set("trust proxy", 1);

// ✅ Configure CORS to allow requests from frontend URLs
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://evently-ems.vercel.app", // Deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add OPTIONS for preflight requests
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors()); // Allow all preflight requests

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin requests
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

// Default route for testing deployment
app.get("/", (req, res) => {
  res.status(200).json({ message: "Evently Backend API is running 🚀" });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

export default app;
