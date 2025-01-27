import dotenv from "dotenv";
import app from "./app";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

if (!DB_NAME) {
  console.error("Error: DB_NAME is not defined in environment variables.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { dbName: DB_NAME })
  .then(() => {
    console.log(`Connected to MongoDB database: ${DB_NAME}`);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit process with failure
  });

export default app;
