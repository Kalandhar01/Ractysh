import "dotenv/config";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import consultationRoutes from "./routes/consultations.js";
import inquiryRoutes from "./routes/inquiries.js";
import mediaRoutes from "./routes/media.js";
import siteRoutes from "./routes/site.js";
import { connectDatabase } from "./lib/db.js";
import { connectPrismaDatabase } from "./lib/prisma.js";
import { setConsultationPrismaEnabled } from "./services/consultationService.js";
import { setMongoEnabled } from "./services/siteContentService.js";

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(helmet());
app.use(
  cors({
    origin: process.env.WEB_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 240
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ractysh-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

const [mongoConnected, prismaConnected] = await Promise.all([connectDatabase(), connectPrismaDatabase()]);
setMongoEnabled(mongoConnected);
setConsultationPrismaEnabled(prismaConnected);

app.listen(port);
