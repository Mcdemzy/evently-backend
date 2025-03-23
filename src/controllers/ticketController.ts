import { Request, Response } from "express";
import Ticket from "../models/ticketModel";
import EventModel from "../models/eventModel";
import { cloudinary, upload } from "../config/cloudinary";
import mongoose from "mongoose";

// Create a Ticket
export const createTicket = async (req: Request, res: Response) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const {
        eventId,
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
      } = req.body;

      // Validate eventId
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ success: false, message: "Invalid event ID" });
      }

      let imageUrl = "";

      // Upload to Cloudinary if an image is provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "tickets",
        });
        imageUrl = result.secure_url;
      }

      // Create new ticket
      const newTicket = new Ticket({
        eventId,
        ticketName,
        ticketType,
        ticketStock,
        availableTickets:
          ticketStock === "limited" ? availableTickets : undefined,
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

      await newTicket.save();

      res.status(201).json({
        success: true,
        message: "Ticket created successfully!",
        ticket: newTicket,
      });
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Get all Tickets
export const getTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Get a Ticket by ID
export const getTicketById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Update a Ticket
export const updateTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndUpdate(id, req.body, { new: true });
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket updated successfully", ticket });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Delete a Ticket
export const deleteTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Get Tickets by Event ID
export const getTicketsByEventId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;

    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ success: false, message: "Invalid event ID" });
      return; // Ensure function exits
    }

    // Find tickets by eventId
    const tickets = await Ticket.find({ eventId });

    if (!tickets.length) {
      res
        .status(404)
        .json({ success: false, message: "No tickets found for this event" });
      return;
    }

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error("Error fetching tickets by event ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
