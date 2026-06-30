import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import generateToken from "../utils/generateToken.js";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message,
    });
  }
};

// LOGIN USER
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message,
    });
  }
};

// GET PROFILE
export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

// SEARCH USERS
export const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            {
              name: {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: req.query.search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const users = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    });

    res.send(users);
  } catch (error) {
    console.log("SEARCH ERROR:", error);

    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message,
    });
  }
};

// DELETE OWN ACCOUNT
export const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const userChats = await Chat.find({
      users: { $elemMatch: { $eq: userId } },
    });

    const chatIds = userChats.map((chat) => chat._id);

    await Message.deleteMany({
      chat: { $in: chatIds },
    });

    await Chat.deleteMany({
      users: { $elemMatch: { $eq: userId } },
    });

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ACCOUNT ERROR:", error);

    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message,
    });
  }
};