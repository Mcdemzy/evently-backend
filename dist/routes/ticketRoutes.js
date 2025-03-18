"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const router = (0, express_1.Router)();
// Ticket Routes
router.post("/create", ticketController_1.createTicket); // Create a ticket
router.get("/", ticketController_1.getTickets); // Get all tickets
// router.get("/:id", getTicketById); // Get a specific ticket by ID
// router.put("/:id", updateTicket); // Update a ticket
// router.delete("/:id", deleteTicket); // Delete a ticket
exports.default = router;
