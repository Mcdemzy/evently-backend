import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventImage,
  getEventsByUser,
} from "../controllers/eventController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Event Routes
router.post("/create", authMiddleware, createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/user/:userId", getEventsByUser);
router.put("/update-image/:id", updateEventImage);

export default router;
