const Chat = require("../models/Chat");
const DmMessage = require("../models/DmMessage");

const getChat = async (req, res) => {
  const { user_id } = req.params;

  try {
    const chat = await Chat.findOne({ user_id })
      .populate("messages.otherUser")
      .exec();

    if (!chat) {
      return res.status(204).json({ error: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { message } = req.body;
  try {
    const chat = await DmMessage.create(message);

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};
const getMessageByDnId = async (req, res) => {
  const { dm_messages_id } = req.params;
  try {
    const chatsdms = await DmMessage.find({ dm_messages_id });

    res.status(200).json(chatsdms);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

module.exports = {
  getChat,
  sendMessage,
  getMessageByDnId,
};
