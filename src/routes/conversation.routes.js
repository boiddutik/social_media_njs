import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createConversation,
    getAllConversations,
    getConversationById,
    addPersonToConversation,
    removePersonFromConversation,
    deleteConversation
} from "../controllers/conversation.controllers.js";

const router = Router();


router.route("/conversations")
    .post(verifyJWT, createConversation);


router.route("/conversations")
    .get(verifyJWT, getAllConversations);


router.route("/conversations/:conversationId")
    .get(verifyJWT, getConversationById)
    .delete(verifyJWT, deleteConversation);


router.route("/conversations/:conversationId/person")
    .post(verifyJWT, addPersonToConversation);


router.route("/conversations/:conversationId/person/:personId")
    .delete(verifyJWT, removePersonFromConversation);

export default router;
