import express from "express";

import {
  registerUser,
  authUser,
  allUsers,
  getUserProfile,
  deleteMyAccount,
} from "../controllers/userController.js";

import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register & Search Users
router
  .route("/")
  .post(registerUser)
  .get(protect, allUsers);

// Login
router.post("/login", authUser);

// Logged-in User Profile
router.get("/profile", protect, getUserProfile);

// Delete Own Account
router.delete("/profile", protect, deleteMyAccount);

export default router;