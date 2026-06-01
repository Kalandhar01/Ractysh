import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { signToken } from "../lib/auth.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid login payload" });
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@ractysh.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me-now";
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  const passwordMatches = storedHash
    ? await bcrypt.compare(parsed.data.password, storedHash)
    : parsed.data.password === adminPassword;

  if (parsed.data.email !== adminEmail || !passwordMatches) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const user = {
    id: "admin",
    email: adminEmail,
    role: "admin" as const
  };

  res.json({
    token: signToken(user),
    user
  });
});

export default router;
