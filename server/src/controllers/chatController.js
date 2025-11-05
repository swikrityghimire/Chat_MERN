import Chat from "../models/Chat.js";

export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chat history", error });
  }
};
