import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  illness: { type: String },
  allergy: { type: String },
  age: { type: Number, required: true },
  sexe: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);
