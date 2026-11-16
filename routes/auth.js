import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" },
  );
}

// Check if admin exists
router.get("/needs-setup", async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "admin" });
    res.json({ needsSetup: count === 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// First admin signup
router.post("/signup", async (req, res) => {
  try {
    const adminExists = await User.countDocuments({ role: "admin" });

    if (adminExists > 0) {
      return res.status(403).json({
        error: "Admin already exists. Please login.",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email, password required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email?.toLowerCase(),
    });

    if (!user || !user.active) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const ok = await user.comparePassword(password);

    if (!ok) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = signToken(user);

    res.json({
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get logged-in user
router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
