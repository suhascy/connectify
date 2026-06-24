import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// CREATE HTTP SERVER
const server = createServer(app);

// SOCKET.IO
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // SETUP
  socket.on("setup", (userData) => {
  if (!userData) {
    console.log("No userData received");
    return;
  }

  socket.join(userData._id);

  console.log("User Joined:", userData._id);

  socket.emit("connected");
});

  // JOIN CHAT
  socket.on("join chat", (room) => {
    socket.join(room);

    console.log("User Joined Room:", room);
  });

  // TYPING
socket.on("typing", (room) => {
  socket.in(room).emit("typing");
});

// STOP TYPING
socket.on("stop typing", (room) => {
  socket.in(room).emit("stop typing");
});

  // NEW MESSAGE
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat users not defined");

    chat.users.forEach((user) => {
      if (
        user._id == newMessageReceived.sender._id
      )
        return;

      socket.in(user._id).emit(
        "message received",
        newMessageReceived
      );
    });
  });

  // DISCONNECT
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");

    socket.leave();
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  console.log(err);

  res.status(res.statusCode || 500).json({
    message: err.message,
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});