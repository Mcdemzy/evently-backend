import { v2 as cloudinary } from "cloudinary";
import express, { Request } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: "tickets",
      format: file.mimetype.split("/")[1],
      public_id: file.originalname.split(".")[0],
    };
  },
});

const upload = multer({ storage });

export { cloudinary, upload };
