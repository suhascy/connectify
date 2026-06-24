import User from "../models/userModel.js";
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

    const user = await User.create({
      name,
      email,
      password,
    });

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
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      user &&
      (await user.matchPassword(password))
    ) {
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
    res.status(500).json({
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
    console.log("--------------------------------");
    console.log("SEARCH REQUEST RECEIVED");
    console.log("SEARCH TERM:", req.query.search);
    console.log("LOGGED USER:", req.user);

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

    console.log("KEYWORD:", keyword);

    const users = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    });

    console.log("FOUND USERS:");
    console.log(users);

    res.send(users);
  } catch (error) {
    console.log("SEARCH ERROR:");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};