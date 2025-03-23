"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const router = (0, express_1.Router)();
router.post("/create", ticketController_1.createTicket);
router.get("/", ticketController_1.getTickets);
router.get("/:id", ticketController_1.getTicketById);
router.get("/event/:eventId", ticketController_1.getTicketsByEventId); // Add this route
router.put("/:id", ticketController_1.updateTicket);
router.delete("/:id", ticketController_1.deleteTicket);
exports.default = router;
