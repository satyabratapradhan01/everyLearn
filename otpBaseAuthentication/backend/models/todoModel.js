import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: { type: String, required: true, trim: true },
    isDone: { type: Boolean, default: false },
  },
  { timeseries: true }
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
