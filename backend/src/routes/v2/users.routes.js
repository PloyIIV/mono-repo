import { Router } from "express";
import { User } from "../../models/user.model.js";

export const router = Router();

// Read users
router.get("/", async (req, res, next) => {
  try {
    const response = await User.find();
    return res.json(response)
  } catch (error) {
    next(error);
  }
});

// Create user
router.post("/", async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    if(!username || !email || !password) {
        return res.status(400).json({
            message: "Missing some data."
        })
    }
    
    const newUser = await User.create({ username, email, password })

    // Convert to JavaScript Object
    const { password: _password, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json(userWithoutPassword)

  } catch (error) {
    next(error);
  }
});

// Update user
router.put("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    
    if(!user) {
      return res.json({
        message: "Couldn't find this user."
      })
    }

    await User.updateOne({ _id: user._id}, req.body)

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
    await User.findByIdAndDelete(req.params.id)
    return res.status(200).json({ msg: "User deleted!!!" });
  } catch (error) {
    next(error);
  }
});