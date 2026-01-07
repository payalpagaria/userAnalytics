import express from "express";
import { createEvent,getEventsBySession,getSessionsWithEventCounts } from "../controller/eventController.js";
import { validateEvent } from "../middlewares/validateEvent.js";
const router = express.Router();

router.post("/", validateEvent, createEvent);
router.get("/sessions", getSessionsWithEventCounts);
router.get("/session/:sessionId", getEventsBySession);
export default router;
