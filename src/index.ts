import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import app from "./app";

// Load environment variables
dotenv.config();

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

// MongoDB Connection Options
const mongooseOptions: ConnectOptions = {
  dbName: DB_NAME,
  retryWrites: true,
  w: "majority" as const,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log(`✅ Connected to MongoDB database: ${DB_NAME}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Start the server
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log("\nShutting down server...");
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
