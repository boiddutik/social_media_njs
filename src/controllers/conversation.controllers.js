import { Conversation } from "../models/Conversation";
import { Profile } from "../models/Profile";


export const createConversation = async (req, res) => {
    const { type, people, title } = req.body;
    try {
        const newConversation = new Conversation({
            type,
            people,
            title,
        });
        await newConversation.save();
        return res.status(201).json(newConversation);
    } catch (error) {
        console.error("Error creating conversation:", error.message);
        res.status(500).json({ message: "Error creating conversation" });
    }
};


export const getAllConversations = async (req, res) => {
    const userId = req.user.id;
    try {
        const conversations = await Conversation.find({
            people: userId,
        })
            .populate("people", "name email")
            .exec();

        return res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error.message);
        res.status(500).json({ message: "Error fetching conversations" });
    }
};


export const getConversationById = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const conversation = await Conversation.findById(conversationId)
            .populate("people", "name email");
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        return res.status(200).json(conversation);
    } catch (error) {
        console.error("Error fetching conversation:", error.message);
        res.status(500).json({ message: "Error fetching conversation" });
    }
};


export const addPersonToConversation = async (req, res) => {
    const { conversationId } = req.params;
    const { personId } = req.body;
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        if (conversation.people.includes(personId)) {
            return res.status(400).json({ message: "Person already in the conversation" });
        }
        conversation.people.push(personId);
        await conversation.save()
        return res.status(200).json(conversation);
    } catch (error) {
        console.error("Error adding person to conversation:", error.message);
        res.status(500).json({ message: "Error adding person to conversation" });
    }
};


export const removePersonFromConversation = async (req, res) => {
    const { conversationId, personId } = req.params;
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        const personIndex = conversation.people.indexOf(personId);
        if (personIndex === -1) {
            return res.status(400).json({ message: "Person not found in the conversation" });
        }
        conversation.people.splice(personIndex, 1);
        await conversation.save();
        return res.status(200).json(conversation);
    } catch (error) {
        console.error("Error removing person from conversation:", error.message);
        res.status(500).json({ message: "Error removing person from conversation" });
    }
};


export const deleteConversation = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const conversation = await Conversation.findByIdAndDelete(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        return res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("Error deleting conversation:", error.message);
        res.status(500).json({ message: "Error deleting conversation" });
    }
};
