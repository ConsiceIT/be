import express from "express";
import { handlePrompt } from "../controllers/venice-controller.js";

const router = express.Router();
router.post("/venice", handlePrompt);

export default router;
