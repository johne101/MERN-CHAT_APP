import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
  
    
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized - no token" });
    }

    const decode = jwt.verify(token, process.env.MY_SECRET_KEY);

    if (!decode) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized - invalid token" });
    }

    const user = await userModel
      .findById({ _id: decode?.id })
      .select("-password");

    if (!user) {
      return res.status(401).json({ status: false, message: "user not found" });
    }

    

    req.user = user;
    next();
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
};

export default protectRoute;