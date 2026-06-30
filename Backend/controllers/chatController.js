import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

// Create or Access One-to-One Chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);

    const fullChat = await Chat.findById(createdChat._id).populate(
      "users",
      "-password"
    );

    res.status(200).send(fullChat);
  }
});

// Fetch All Chats of Logged-in User
const fetchChats = asyncHandler(async (req, res) => {
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  res.status(200).json(chats);
});

// Delete Chat - only if logged-in user belongs to that chat
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  const isUserInChat = chat.users.some(
    (chatUserId) => chatUserId.toString() === req.user._id.toString()
  );

  if (!isUserInChat) {
    res.status(403);
    throw new Error("You are not allowed to delete this chat");
  }

  await Message.deleteMany({ chat: chatId });
  await Chat.findByIdAndDelete(chatId);

  res.status(200).json({
    message: "Chat deleted successfully",
    chatId,
  });
});

export { accessChat, fetchChats, deleteChat };