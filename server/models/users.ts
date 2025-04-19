import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  illness:  [{ type: String }],
  allergy:  [{ type: String }],
  age: { type: Number, required: true },
  sexe: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

userSchema.pre("save", async function(next) {
    // Ne hasher le mot de passe que s'il a été modifié (ou nouveau)
    if (!this.isModified("password")) return next();
    
    try {
      // Générer un salt
      const salt = await bcrypt.genSalt(10);
      
      // Hasher le mot de passe avec le salt
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error as mongoose.CallbackError);
    }
  });

export const User = mongoose.model("User", userSchema);
