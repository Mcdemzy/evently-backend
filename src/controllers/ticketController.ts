import { Request, Response } from "express";
import Ticket from "../models/ticketModel";
import EventModel from "../models/eventModel";

// Create a Ticket
export const createTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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

    // Ensure eventId is provided
    if (!eventId) {
      res.status(400).json({ error: "Event ID is required" });
      return;
    }

    // Check if the event exists
    const event = await EventModel.findById(eventId);
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    // Create a new ticket associated with the event
    const ticket = new Ticket({
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

    await ticket.save();
    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
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
