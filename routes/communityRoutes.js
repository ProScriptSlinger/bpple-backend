const express = require("express");
const router = express.Router();
const deserializeUser = require("../middleware/deserializeUser");
const requireUser = require("../middleware/requireUser");
const {
  createCommunity,
  sendMessage,
  getCommunityMessages,
  joinCommunity,
  getCommunity,
  getChannels,
  getUserCommunities,
  createChannel,
  getChannelMessages,
  updateNFTs,
} = require("../controllers/communityController");

// Require Auth
router.use(deserializeUser, requireUser);

// Routes
router.post("/", createCommunity);
router.post("/:communityId/channel/create", createChannel);
router.get("/:communityId/community", getCommunity);
router.get("/:userId/user", getUserCommunities);
router.get("/:communityId/channel", getChannels);
router.get("/:communityId/channel/:channelId", getChannelMessages);
router.post("/:communityId/messages", sendMessage);
router.get("/:communityId/messages", getCommunityMessages);
router.put("/:communityId/join/:userId", joinCommunity);
router.put("/:communityId/update-nfts", updateNFTs);

module.exports = router;
