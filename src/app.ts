import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default route for testing deployment
app.get("/", (req, res) => {
  res.status(200).send("Evently Backend API is running...");
});

// API Routes
app.use("/api/users", userRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
