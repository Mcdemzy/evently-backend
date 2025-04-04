import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
  eventName: string;
  category: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  eventLocation: "physical" | "online" | "both";
  country?: string;
  state?: string;
  location?: string;
  url?: string;
  eventImage: string;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    eventLocation: {
      type: String,
      enum: ["physical", "online", "both"],
      required: true,
    },
    country: {
      type: String,
      required: function () {
        return this.eventLocation === "physical";
      },
    },
    state: {
      type: String,
      required: function () {
        return this.eventLocation === "physical";
      },
    },
    location: {
      type: String,
      required: function () {
        return this.eventLocation === "physical";
      },
    },
    url: {
      type: String,
      required: function () {
        return this.eventLocation === "online";
      },
    },
    eventImage: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
