import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import { isAuthenticated } from "../middleware/auth.js";

import { findUserByEmail, createUser } from "../models/users.js";

const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = createUser({
      email,
      passwordHash: hashedPassword,
      name,
    });

    // Don't send password back
    delete user.password;

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = findUserByEmail(email);
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     //verify password
//     const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     delete user.passwordHash; // Remove password hash before sending user data

//     res.status(200).json({ message: "Login successful", user });
//   } catch (error) {
//     console.error("Error during login:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// });

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?msg='Invalid credentials'",
  })
);

// Get current user (protected route)
router.get("/user", isAuthenticated, (req, res) => {
  delete req.user.passwordHash;
  res.json({ user: req.user });
});

// Logout endpoint
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    // res.json({ message: "Logout successful" });
    res.redirect("/");
  });
});

export default router;
