import { number } from "joi";
import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  failedLoginAttempts: number;
  lockUntil: number | null;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //ensures a valid email format
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 200,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Number, //timestamp
    default: null,
  },
});

export const UserModel = mongoose.model<User & Document>("User", userSchema);
