import express from "express";
import { getAllChats } from "../controllers/chatController.js";

const router = express.Router();

router.get("/", getAllChats);

export default router;
