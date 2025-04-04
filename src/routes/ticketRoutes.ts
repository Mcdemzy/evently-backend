import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
  getTicketsByEventId, // Add this
} from "../controllers/ticketController";

const router = Router();

router.post("/create", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.get("/event/:eventId", getTicketsByEventId); // Add this route
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
