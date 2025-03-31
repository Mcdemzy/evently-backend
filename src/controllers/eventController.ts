import { Request, Response } from "express";
import Event from "../models/eventModel";
import Ticket from "../models/ticketModel";
import { cloudinary, upload } from "../config/cloudinary";
import mongoose from "mongoose";

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

    // Fetch all tickets associated with this event
    const tickets = await Ticket.find({ eventId: id });

    res.status(200).json({ event, tickets });
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

// Get events created by a specific user
export const getEventsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;

    // Validate userId
    if (!userId) {
      res.status(400).json({ message: "User ID is required." });
      return; // Ensure the function exits after sending the response
    }

    // Fetch events created by the user
    const events = await Event.find({ createdBy: userId });

    // Return the events
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

//update event image
export const updateEventImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    upload.single("eventImage")(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const { id } = req.params;

      // Validate event ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid event ID" });
      }

      let imageUrl = "";

      // Upload image to Cloudinary if a file is provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "events",
        });
        imageUrl = result.secure_url;
      } else {
        return res
          .status(400)
          .json({ success: false, message: "No image uploaded" });
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { eventImage: imageUrl },
        { new: true }
      );

      if (!updatedEvent) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      res.status(200).json({
        success: true,
        message: "Event image updated successfully",
        event: updatedEvent,
      });
    });
  } catch (error) {
    console.error("Error updating event image:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
