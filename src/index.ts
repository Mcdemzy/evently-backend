import dotenv from "dotenv";
import mongoose from "mongoose";
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

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB..."); // Debugging: Log connection attempt
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
      retryWrites: true,
      w: "majority",
    });
    console.log(`✅ Connected to MongoDB database: ${DB_NAME}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Start the server
const startServer = async () => {
  await connectDB(); // Ensure database is connected before starting the server
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

  process.on("SIGINT", shutdown); // Handle Ctrl+C
  process.on("SIGTERM", shutdown); // Handle termination signals
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
