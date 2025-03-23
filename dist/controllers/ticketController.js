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
exports.getTicketsByEventId = exports.deleteTicket = exports.updateTicket = exports.getTicketById = exports.getTickets = exports.createTicket = void 0;
const ticketModel_1 = __importDefault(require("../models/ticketModel"));
const cloudinary_1 = require("../config/cloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
// Create a Ticket
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        cloudinary_1.upload.single("image")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            const { eventId, ticketName, ticketType, ticketStock, availableTickets, purchaseLimit, ticketPrice, benefits, ticketDescription, bank, accountNumber, accountName, socials, } = req.body;
            // Validate eventId
            if (!mongoose_1.default.Types.ObjectId.isValid(eventId)) {
                res.status(400).json({ success: false, message: "Invalid event ID" });
            }
            let imageUrl = "";
            // Upload to Cloudinary if an image is provided
            if (req.file) {
                const result = yield cloudinary_1.cloudinary.uploader.upload(req.file.path, {
                    folder: "tickets",
                });
                imageUrl = result.secure_url;
            }
            // Create new ticket
            const newTicket = new ticketModel_1.default({
                eventId,
                ticketName,
                ticketType,
                ticketStock,
                availableTickets: ticketStock === "limited" ? availableTickets : undefined,
                purchaseLimit,
                ticketPrice: ticketType === "paid" ? ticketPrice : undefined,
                benefits,
                ticketDescription,
                bank: ticketType === "paid" ? bank : undefined,
                accountNumber: ticketType === "paid" ? accountNumber : undefined,
                accountName: ticketType === "paid" ? accountName : undefined,
                socials: socials || {}, // Ensure empty object if not provided
                image: imageUrl, // Store Cloudinary image URL
            });
            yield newTicket.save();
            res.status(201).json({
                success: true,
                message: "Ticket created successfully!",
                ticket: newTicket,
            });
        }));
    }
    catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
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
            res.status(404).json({ message: "Ticket not found" });
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
            res.status(404).json({ message: "Ticket not found" });
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
            res.status(404).json({ message: "Ticket not found" });
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
// Get Tickets by Event ID
const getTicketsByEventId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        // Validate eventId
        if (!mongoose_1.default.Types.ObjectId.isValid(eventId)) {
            res.status(400).json({ success: false, message: "Invalid event ID" });
            return; // Ensure function exits
        }
        // Find tickets by eventId
        const tickets = yield ticketModel_1.default.find({ eventId });
        if (!tickets.length) {
            res
                .status(404)
                .json({ success: false, message: "No tickets found for this event" });
            return;
        }
        res.status(200).json({ success: true, tickets });
    }
    catch (error) {
        console.error("Error fetching tickets by event ID:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getTicketsByEventId = getTicketsByEventId;
