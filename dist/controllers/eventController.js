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
exports.getEventsByUser = exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const eventModel_1 = __importDefault(require("../models/eventModel"));
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "User not authenticated." });
            return;
        }
        const { eventName, category, description, startDate, endDate, startTime, endTime, eventLocation, country, state, location, url, } = req.body;
        const event = new eventModel_1.default({
            eventName,
            category,
            description,
            startDate,
            endDate,
            startTime,
            endTime,
            eventLocation,
            country,
            state,
            location,
            url,
            createdBy: req.user.id,
        });
        yield event.save();
        res.status(201).json({ message: "Event created successfully", event });
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});
exports.createEvent = createEvent;
// Get all events
const getEvents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield eventModel_1.default.find().populate("createdBy", "firstName lastName email"); // Populate user details
        res.status(200).json(events);
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
exports.getEvents = getEvents;
// Get an event by ID
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "Event ID is required" });
            return;
        }
        const event = yield eventModel_1.default.findById(id);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json(event);
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
exports.getEventById = getEventById;
// Update an event
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "Event ID is required" });
            return;
        }
        const event = yield eventModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json({ message: "Event updated successfully", event });
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
exports.updateEvent = updateEvent;
// Delete an event
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "Event ID is required" });
            return;
        }
        const event = yield eventModel_1.default.findByIdAndDelete(id);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json({ message: "Event deleted successfully" });
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
exports.deleteEvent = deleteEvent;
// Get events created by a specific user
const getEventsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Validate userId
        if (!userId) {
            res.status(400).json({ message: "User ID is required." });
            return; // Ensure the function exits after sending the response
        }
        // Fetch events created by the user
        const events = yield eventModel_1.default.find({ createdBy: userId });
        // Return the events
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});
exports.getEventsByUser = getEventsByUser;
