import { Chat } from "../models/chatModel.js";


export const createChat = async (req, res) => {
    try {
        const { conversation, sender, text, media, type } = req.body;

        const newChat = new Chat({
            conversation,
            sender,
            text,
            media,
            type,
        });

        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getChats = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const chats = await Chat.find({ conversation: conversationId })
            .populate("sender", "name")
            .populate("conversation");

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getChatById = async (req, res) => {
    try {
        const { messageId } = req.params;
        const chat = await Chat.findById(messageId)
            .populate("sender", "name")
            .populate("conversation");

        if (!chat) return res.status(404).json({ message: "Message not found" });

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateMessageStatus = async (req, res) => {
    try {
        const { messageId } = req.params;
        const chat = await Chat.findById(messageId);

        if (!chat) return res.status(404).json({ message: "Message not found" });

        chat.isSeen = true;
        await chat.save();

        res.status(200).json({ message: "Message marked as seen", chat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteChatMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const chat = await Chat.findByIdAndDelete(messageId);

        if (!chat) return res.status(404).json({ message: "Message not found" });

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
