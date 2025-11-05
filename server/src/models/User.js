import { model, Schema } from "mongoose";

const userSchema = Schema(
  {
    fullName: {
      type: String,
      required: [true, "fullName is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required."],
      unique: true,
    },
    password: { type: String, required: [true, "password is required."] },
    isOnline: { type: Boolean, default: false },
  },
  { timestamp: true }
);

const User = model("User", userSchema);

export default User;
