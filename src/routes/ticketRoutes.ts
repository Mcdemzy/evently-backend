import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from "../controllers/ticketController";

const router = Router();

// Ticket Routes
router.post("/create", createTicket); // Create a ticket
router.get("/", getTickets); // Get all tickets
// router.get("/:id", getTicketById); // Get a specific ticket by ID
// router.put("/:id", updateTicket); // Update a ticket
// router.delete("/:id", deleteTicket); // Delete a ticket

export default router;
