import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  created_at: Date;
  points: number;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
