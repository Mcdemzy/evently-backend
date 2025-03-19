import mongoose, { Schema, Document } from "mongoose";
interface ITicket extends Document {
  eventId: mongoose.Types.ObjectId;
  ticketName: string;
  ticketType: "free" | "paid";
  ticketStock: "limited" | "unlimited";
  availableTickets?: number;
  purchaseLimit: number;
  ticketPrice?: number;
  benefits: string;
  ticketDescription: string;
  bank?: string;
  accountNumber?: number;
  accountName?: string;
  socials?: {
    webUrl?: string;
    twitter?: string;
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
    telegram?: string;
  };
  image?: string;
}

const TicketSchema = new Schema<ITicket>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
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
  },
  { timestamps: true }
);

const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);
export default Ticket;
