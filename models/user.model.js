import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      emun: ["male", "female"],
    },
    profilepic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);
