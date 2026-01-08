import express from "express";
import { createEvent,getEventsBySession,getSessionsWithEventCounts,getClickHeatmapForPage, getHeatmapPages} from "../controller/eventController.js";
import { validateEvent } from "../middlewares/validateEvent.js";
const router = express.Router();

router.post("/", validateEvent, createEvent);
router.get("/sessions", getSessionsWithEventCounts);
router.get("/session/:sessionId", getEventsBySession);
router.get("/clicks/heatmap", getClickHeatmapForPage);
router.get("/heatmap/pages", getHeatmapPages);

export default router;
