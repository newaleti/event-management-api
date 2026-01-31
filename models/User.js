import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // lowercase to avoid duplicates
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"], // Basic Regex check
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
); // This automatically adds 'createdAt' and 'updatedAt' fields!

const User = mongoose.model("User", userSchema);
export default User;
