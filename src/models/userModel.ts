import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  resetPasswordOTP?: string;
  resetPasswordExpires?: number;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
