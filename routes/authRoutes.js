import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// User registration route
router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  // Basic validation
  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    // Save user
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    // Handle duplicate key errors from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// User login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // 3. Success! Send back a token or success message
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload: data we want to store
      process.env.JWT_SECRET, // Secret key to sign the token
      { expiresIn: "1h" }, // Token life span
    );
    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
