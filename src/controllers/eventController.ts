import { Request, Response } from "express";
import Event from "../models/eventModel";

interface AuthRequest extends Request {
  user?: { id: string; email: string; username: string };
}
export const createEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }

    const {
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
    } = req.body;

    const event = new Event({
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

    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// Get all events
export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find().populate(
      "createdBy",
      "firstName lastName email"
    ); // Populate user details
    res.status(200).json(events);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Get an event by ID
export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Event ID is required" });
      return;
    }

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json(event);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Update an event
export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Event ID is required" });
      return;
    }

    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Delete an event
export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Event ID is required" });
      return;
    }

    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
