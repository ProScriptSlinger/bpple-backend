const { v4: uuidv4 } = require("uuid");
const Chat = require("../models/Chat");
const DmMessage = require("../models/DmMessage");

const startChatWithUser = async (requestId, recipient, sender) => {
  const dm_messages_id = uuidv4();
  const time = new Date();
  const chats = await Chat.find({
    messages: {
      $elemMatch: {
        requestId: requestId,
      },
    },
  });

  if (chats.length > 0) {
    // Assuming you want the FIRST matching message
    const message = chats[0].messages.find(
      (message) => message.requestId === requestId
    );

    if (message) {
      console.log("Found dm_messages_id:", message.dm_messages_id);
      return message.dm_messages_id;
    } else {
      console.log("No message found with that requestId within the chat.");
    }
  } else {
    console.log("No chats found with messages containing that requestId.");
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

      return dm_messages_id;
    } catch (error) {
      console.error("Error creating chat:", error);
      return { error, ok: false };
    }
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
