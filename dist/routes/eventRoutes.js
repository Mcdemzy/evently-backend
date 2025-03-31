"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Event Routes
router.post("/create", authMiddleware_1.authMiddleware, eventController_1.createEvent);
router.get("/", eventController_1.getEvents);
router.get("/:id", eventController_1.getEventById);
router.put("/:id", eventController_1.updateEvent);
router.delete("/:id", eventController_1.deleteEvent);
router.get("/user/:userId", eventController_1.getEventsByUser);
exports.default = router;
