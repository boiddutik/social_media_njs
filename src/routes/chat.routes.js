import express from "express";
import {
    createChat,
    getChats,
    getChatById,
    updateMessageStatus,
    deleteChatMessage,
} from "../controllers/chatController.js";

const router = express.Router();


router.post("/", createChat);


router.get("/:conversationId", getChats);


router.get("/message/:messageId", getChatById);


router.put("/message/:messageId/status", updateMessageStatus);


router.delete("/message/:messageId", deleteChatMessage);

export default router;
