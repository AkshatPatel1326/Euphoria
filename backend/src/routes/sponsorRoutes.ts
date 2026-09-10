import { Router } from "express";
import { getAllSponsorsHandler } from "../controllers/sponsorController";

const router = Router();

/**
 * @route   GET /api/sponsors
 * @desc    Get all festival sponsors (optional ?featured=true)
 * @access  Public
 */
router.get("/", getAllSponsorsHandler);

export default router;
