import express from "express";
import {
  accessChat,
  fetchChats,
  deleteChat,
} from "../controllers/chatController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);

router.route("/:chatId").delete(protect, deleteChat);

export default router;