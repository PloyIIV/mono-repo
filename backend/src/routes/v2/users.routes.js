import { Router } from "express";
import { User } from "../../models/user.model.js";
import bcrypt, { compare } from 'bcrypt'

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
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    if(!username || !email || !password) {
        return res.status(400).json({
            message: "Missing some data."
        })
    }
    const newPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ username, email, password: newPassword })

    return res.status(201).json(newUser)

  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if(!username && !password) {
      return res.status(400).json({
        message: "Missing data."
      })
    }

    const checkUser = await User.findOne({username})
    console.log(checkUser)
    if(!checkUser) {
      return res.status(401).json({
        message: "User not found."
      })
    }
    const comparedPassword = await bcrypt.compare(req.body.password, checkUser.password)
    if(!comparedPassword) {
      return res.status(401).json({
        message: "Password is incorrect."
      })
    }
    console.log(checkUser)
    console.log(comparedPassword)
    return res.json({ message: 'blahblah'})
  } catch (error) {
    // next(error)
    console.log(error)
  }
})

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
    const result = await User.findByIdAndDelete(req.params.id)
    console.log(result)
    if(!result) {
      return res.json({
        message: "Invalid User ID"
      })
    }
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
});