import express from "express";
import connectDB from "./dbConfig/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRoute);
app.use("/api/users", userRoute);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("server is running on port 8000....🏃‍♂️");
});
