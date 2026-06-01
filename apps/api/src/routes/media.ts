import { v2 as cloudinary } from "cloudinary";
import { Router } from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../lib/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/", requireAuth, requireRole("admin"), upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      res.status(501).json({
        message: "Cloudinary is not configured",
        filename: req.file.originalname
      });
      return;
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ractysh-group",
          resource_type: "auto"
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );

      stream.end(req.file?.buffer);
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
