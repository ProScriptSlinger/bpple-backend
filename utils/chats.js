const { v4: uuidv4 } = require("uuid");
const Chat = require("../models/Chat");
const DmMessage = require("../models/DmMessage");

const startChatWithUser = async (requestId, recipient, sender) => {
  const dm_messages_id = uuidv4();
  const time = new Date();
  try {
    const updatedUser = await Chat.findOneAndUpdate(
      { user_id: recipient.user_id },
      {
        $push: {
          messages: {
            otherUser_id: sender.user_id,
            otherUser: sender._id,
            dm_messages_id: dm_messages_id,
            last_message: "",
            requestId,
            at: time.toString(),
          },
        },
      },
      { new: true }
    );

    const updatedOtherUser = await Chat.findOneAndUpdate(
      { user_id: sender.user_id },
      {
        $push: {
          messages: {
            otherUser_id: recipient.user_id,
            dm_messages_id: dm_messages_id,
            otherUser: recipient._id,
            last_message: "",
            requestId,
            at: time.toString(),
          },
        },
      },
      { new: true }
    );

    console.log("Chat added successfully:");

    return {
      updatedUser,
      recipient,
      sender,
      updatedOtherUser,
      dm_messages_id,
      ok: true,
    };
  } catch (error) {
    console.error("Error creating chat:", error);
    return { error, ok: false };
  }
};

const createUserChatContainer = async (user_id, doc_user_id) => {
  const createdAt = new Date();
  console.log("Called:");

  try {
    const chatContainer = await Chat.create({
      user: doc_user_id,
      user_id,
      at: createdAt.toString(),
      messages: [],
    });

    console.log("Chat container added successfully:");
    return { ...chatContainer, ok: true };
  } catch (error) {
    console.error("Error creating chat container:", error);
    return { error, ok: false };
  }
};

module.exports = { startChatWithUser, createUserChatContainer };
