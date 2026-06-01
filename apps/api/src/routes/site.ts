import { Router } from "express";
import { requireAuth, requireRole } from "../lib/auth.js";
import { getSiteContent, updateSiteContent } from "../services/siteContentService.js";
import { siteContentSchema } from "../validation/siteContent.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await getSiteContent());
  } catch (error) {
    next(error);
  }
});

router.put("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const parsed = siteContentSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "Invalid site content",
        issues: parsed.error.issues
      });
      return;
    }

    res.json(await updateSiteContent(parsed.data));
  } catch (error) {
    next(error);
  }
});

export default router;
