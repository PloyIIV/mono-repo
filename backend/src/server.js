import express from "express";
import { users } from "./fakeDB/fakeUsers.js";

const app = express();
app.use(express.json());

// CRUD routes and endpoints

// Read users
app.get("/users", (req, res, next) => {
  try {
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Create user
app.post("/users", (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email, password are required!" });
    }

    const highestId = users.reduce(
      (max, user) => Math.max(max, Number(user.id)),
      0,
    );

    const nextId = String(highestId + 1);

    const newUser = {
      id: nextId,
      username: username,
      email: email,
      password: password,
    };

    users.push(newUser);

    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Update user
app.put("/users/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email, password are required" });
    }

    user.username = username;
    user.email = email;
    user.password = password;

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Delete user
app.delete("/users/:id", (req, res, next) => {
  try {
    const { id } = req.params;

    // findIndex and splice()
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users.splice(index, 1);

    return res.status(200).json({ msg: "User deleted!!!" });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  return res.status(500).json({
    error: "Something went wrong on the server...",
    message: err.message,
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Sever running on PORT:${PORT} 🟢`);
});
