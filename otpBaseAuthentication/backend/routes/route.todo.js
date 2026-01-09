import express from "express";
import Todo from "../models/todoModel.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
const todoRouter = express.Router();

todoRouter.post("/add", authMiddleware, async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ message: "Task is required" });
    }

    const todo = await Todo.create({
      user: req.userId,
      task,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to add todo" });
    console.log(error.message);
  }
});

todoRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});

todoRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { isDone } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      { _id: req.params.id, user: req.userId },
      { isDone },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to update todo" });
  }

  todoRouter.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const todo = await Todo.findOneAndDelete({
        _id: req.params.id,
        user: req.userId,
      });

      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.json({ message: "Todo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "failed to delete todo" });
    }
  });
});

export default todoRouter;
