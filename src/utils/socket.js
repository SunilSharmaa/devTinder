const socket = require("socket.io");
const { Chat } = require("../models/chatModel");

const initializeSocket = (server) => {
  console.log("hello");
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //handles events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text, tempId }) => {
        try {
          const roomId = [userId, targetUserId].sort().join("_");

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text: text.trim(),
          });
          await chat.save();

          // 🔥 NEW: Get sender details from DB
          await chat.populate({
            path: "messages.senderId",
            select: "firstName lastName _id",
          });

          const savedMessage = chat.messages[chat.messages.length - 1];

          // 🔥 NEW: Rich message data
          io.to(roomId).emit("messageReceived", {
            id: savedMessage._id.toString(),
            tempId,
            firstName: savedMessage.senderId.firstName,
            lastName: savedMessage.senderId.lastName,
            text: savedMessage.text,
            senderId: savedMessage.senderId._id.toString(),
            timestamp: savedMessage.createdAt,
          });
        } catch (err) {
          console.log("Socket error:", err);
        }
      },
    );
  });
};

module.exports = { initializeSocket };
