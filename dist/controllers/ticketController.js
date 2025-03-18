"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = exports.updateTicket = exports.getTicketById = exports.getTickets = exports.createTicket = void 0;
const ticketModel_1 = __importDefault(require("../models/ticketModel"));
const eventModel_1 = __importDefault(require("../models/eventModel")); // Rename the import
// Create a Ticket
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, ticketName, ticketType, ticketStock, availableTickets, purchaseLimit, ticketPrice, benefits, ticketDescription, bank, accountNumber, accountName, socials, } = req.body;
        // Ensure eventId is provided
        if (!eventId) {
            res.status(400).json({ error: "Event ID is required" });
            return;
        }
        // Check if the event exists
        const event = yield eventModel_1.default.findById(eventId);
        if (!event) {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        // Create a new ticket associated with the event
        const ticket = new ticketModel_1.default({
            eventId, // Link ticket to the event
            ticketName,
            ticketType,
            ticketStock,
            availableTickets,
            purchaseLimit,
            ticketPrice,
            benefits,
            ticketDescription,
            bank,
            accountNumber,
            accountName,
            socials,
        });
        yield ticket.save();
        res.status(201).json({ message: "Ticket created successfully", ticket });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.createTicket = createTicket;
// Get all Tickets
const getTickets = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield ticketModel_1.default.find();
        res.status(200).json(tickets);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.getTickets = getTickets;
// Get a Ticket by ID
const getTicketById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ticket = yield ticketModel_1.default.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json(ticket);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.getTicketById = getTicketById;
// Update a Ticket
const updateTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ticket = yield ticketModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ message: "Ticket updated successfully", ticket });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.updateTicket = updateTicket;
// Delete a Ticket
const deleteTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ticket = yield ticketModel_1.default.findByIdAndDelete(id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ message: "Ticket deleted successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.deleteTicket = deleteTicket;
