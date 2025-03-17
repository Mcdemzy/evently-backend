import { Request, Response } from "express";
import Event from "../models/eventModel";
// import { AuthRequest } from "../middleware/authMiddleware";
// Create an event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Get all events
export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find();
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
