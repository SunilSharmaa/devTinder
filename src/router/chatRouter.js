const express = require("express");
const userAuth = require("../validation/authUser");
const {Chat} = require("../models/chatModel");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName _id",  // Added _id
    }).sort({ 'messages.createdAt': 1 });  // Added sorting

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json({ messages: chat.messages });  // Structured response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chat' });  // Proper error response
  }
});


module.exports = chatRouter;
