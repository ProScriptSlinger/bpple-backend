const { Router } = require("express");

const router = Router();

// Import controllers for handling different routes
const { getChat, sendMessage, getMessageByDnId } = require("../controllers/chatsController");

router.get("/:user_id", getChat);
router.post("/message", sendMessage);
router.get("/messages/:dm_messages_id", getMessageByDnId);

module.exports = router;
