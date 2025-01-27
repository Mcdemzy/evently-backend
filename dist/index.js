"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in environment variables.");
    process.exit(1);
}
// Connect to MongoDB
mongoose_1.default
    .connect(MONGO_URI, { dbName: process.env.DB_NAME || "defaultDB" })
    .then(() => {
    console.log("Connected to MongoDB");
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit process with failure
});
exports.default = app_1.default;
