import { Router } from "express";
import { User } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const router = Router();

// Read users
router.get("/", async (req, res, next) => {
  try {
    const response = await User.find();
    return res.json(response);
  } catch (error) {
    next(error);
  }
});

// Create user
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        message: "Missing some data.",
      });
    }
    const newUser = await User.create({ username, email, password, role });

    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Missing data.",
        success: false,
      });
    }

    const user = await User.findOne({ username }).select("+password");
    console.log(user);
    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }
    console.log(user);

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
      return res.status(400).json({
        message: "Password is incorrect.",
      });
    }
    console.log(comparedPassword);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const isProd = process.env.NODE_ENV === "production"

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: '/',
      maxAge: 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { _id: user._id, username: user.username, role: user.role, email: user.email }
    })
  } catch (error) {
    next(error);
  }
});

// Update user
router.put("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.json({
        message: "Couldn't find this user.",
      });
    }

    await User.updateOne({ _id: user._id }, req.body);

    return res.status(200).json({
      message: "Updating User Successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    console.log(result);
    if (!result) {
      return res.json({
        message: "Invalid User ID",
      });
    }
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
});
