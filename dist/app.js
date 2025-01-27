"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Default route for testing deployment
app.get("/", (req, res) => {
    res.status(200).send("Evently Backend API is running...");
});
// API Routes
app.use("/api/users", userRoutes_1.default);
// 404 Handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});
exports.default = app;
