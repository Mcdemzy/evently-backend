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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const errorHandler_1 = require("./middlewares/errorHandler");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
// Validate environment variables
if (!MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in environment variables.");
    process.exit(1);
}
if (!DB_NAME) {
    console.error("Error: DB_NAME is not defined in environment variables.");
    process.exit(1);
}
// Connect to MongoDB
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Attempting to connect to MongoDB..."); // Debugging: Log connection attempt
        yield mongoose_1.default.connect(MONGO_URI, {
            dbName: DB_NAME,
            retryWrites: true,
            w: "majority",
        });
        console.log(`✅ Connected to MongoDB database: ${DB_NAME}`);
    }
    catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
});
// Start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB(); // Ensure database is connected before starting the server
    // Add the error-handling middleware
    app_1.default.use(errorHandler_1.errorHandler);
    const server = app_1.default.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
    // Graceful shutdown
    const shutdown = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("\nShutting down server...");
        yield mongoose_1.default.connection.close();
        console.log("✅ MongoDB connection closed.");
        server.close(() => {
            console.log("Server closed.");
            process.exit(0);
        });
    });
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
});
startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
