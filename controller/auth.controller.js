import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { fullname, username, password, confirmpassword, gender } = req.body;

    if (password !== confirmpassword) {
      res.status(400).json({
        status: false,
        message: "password does not match, try again...",
      });
    }

    const user = await userModel.findOne({ username });

    if (user) {
      res
        .status(400)
        .json({ status: false, message: "user already exist...try login" });
    }

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy/username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl/username=${username}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new userModel({
      fullname,
      username,
      password: hashedPassword,
      profilepic: gender === "male" ? boyProfilePic : girlProfilePic,
      gender,
    });

    const id = user?._id;

    const token = jwt.sign({ id }, process.env.MY_SECRET_KEY, {
      expiresIn: "15d",
    });

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    await newUser.save();
    res.status(201).json({
      status: true,
      message: "signup successfull",
      data: {
        id: newUser?._id,
        fullname: newUser?.fullname,
        username: newUser?.username,
        profilepic: newUser?.profilepic,
        gender,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    const isCorrectPassword = await bcrypt.compare(password, user?.password);

    if (!user || !isCorrectPassword) {
      res.status(400).json({
        status: false,
        message: "password or username is not correct",
      });
    }
    const id = user?._id;
    const token = jwt.sign({ id }, process.env.MY_SECRET_KEY, {
      expiresIn: "15d",
    });

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
      status: true,
      message: "login successfull",
      data: {
        id: user?._id,
        fullname: user?.fullname,
        username: user?.username,
        profilepic: user?.profilepic,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      status: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
