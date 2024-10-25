import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected...🎉");
        
    } catch (error) {
        console.log("Failed to connect DB...try again...!🧨");

    }
}

export default connectDB;