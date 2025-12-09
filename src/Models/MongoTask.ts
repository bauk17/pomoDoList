import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./MongoUser";

export interface ITask extends Document {
  task: string;
  description: string;
  isDone: boolean;
  created_at: Date;
  userId: mongoose.Types.ObjectId | IUser;
}

const TaskSchema = new Schema<ITask>({
  task: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDone: {
    type: Boolean,
  },
});

const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;
