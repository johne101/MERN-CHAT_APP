import { userModel } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filterrredIUsers = await userModel
      .find({
        _id: { $ne: loggedInUserId },
      })
      .select("-password");

    res.status(200).json({ status: true, users: filterrredIUsers });
  } catch (error) {
    res.status(500).json({ status: false, message: "internal server error" });
  }
};
