import { Chat } from "../models/chat.model.js";
import { Profile } from "../models/profile.model.js";


export const createChat = async (req, res) => {
    try {
        const { conversation, sender, text, media, type } = req.body;
        const profile = await Profile.findById(sender);
        if (!profile) {
            return res.status(404).json({ message: "Sender profile not found." });
        }
        const newChat = new Chat({
            conversation,
            sender,
            text,
            media,
            type,
        });
        await newChat.save();
        const populatedChat = await newChat.populate('sender', 'userName fullName avatar');
        res.status(201).json(populatedChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChats = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const chats = await Chat.find({ conversation: conversationId })
            .populate('sender', 'userName fullName avatar')
            .populate('conversation');
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getChatById = async (req, res) => {
    try {
        const { messageId } = req.params;
        const chat = await Chat.findById(messageId)
            .populate('sender', 'userName fullName avatar')
            .populate('conversation');
        if (!chat) return res.status(404).json({ message: "Message not found" });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateMessageStatus = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { sender } = req.body;
        const chat = await Chat.findById(messageId);
        if (!chat) return res.status(404).json({ message: "Message not found" });
        if (chat.sender.toString() !== sender.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this message" });
        }
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
        const { sender } = req.body;
        const chat = await Chat.findById(messageId);
        if (!chat) return res.status(404).json({ message: "Message not found" });
        if (chat.sender.toString() !== sender.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this message" });
        }
        await chat.remove();
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
