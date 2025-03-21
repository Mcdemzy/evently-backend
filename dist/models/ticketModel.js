"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const TicketSchema = new mongoose_1.Schema({
    eventId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Event", required: true },
    ticketName: { type: String, required: true },
    ticketType: { type: String, enum: ["free", "paid"], required: true },
    ticketStock: {
        type: String,
        enum: ["limited", "unlimited"],
        required: true,
    },
    availableTickets: {
        type: Number,
        required: function () {
            return this.ticketStock === "limited";
        },
    },
    purchaseLimit: { type: Number, required: true },
    ticketPrice: {
        type: Number,
        required: function () {
            return this.ticketType === "paid";
        },
    },
    benefits: { type: String, required: true },
    ticketDescription: { type: String, required: true },
    bank: {
        type: String,
        required: function () {
            return this.ticketType === "paid";
        },
    },
    accountNumber: {
        type: Number,
        required: function () {
            return this.ticketType === "paid";
        },
    },
    accountName: {
        type: String,
        required: function () {
            return this.ticketType === "paid";
        },
    },
    socials: {
        webUrl: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        whatsapp: { type: String },
        facebook: { type: String },
        telegram: { type: String },
    },
    image: { type: String },
}, { timestamps: true });
const Ticket = mongoose_1.default.model("Ticket", TicketSchema);
exports.default = Ticket;
