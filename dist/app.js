"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
// ✅ Enable trust proxy (Fixes rate-limit issue)
app.set("trust proxy", 1);
// ✅ Configure CORS to allow requests from frontend URLs
const allowedOrigins = [
    "http://localhost:5173", // Local development
    "https://evently-ems.vercel.app", // Deployed frontend
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add OPTIONS for preflight requests
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
// Handle preflight requests
app.options("*", (0, cors_1.default)()); // Allow all preflight requests
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin requests
}));
// Logging middleware
app.use((0, morgan_1.default)("dev"));
// Body parser
app.use(express_1.default.json());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
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
app.use("/api/users", userRoutes_1.default);
// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});
exports.default = app;
