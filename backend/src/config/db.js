import mongoose from "mongoose";
import { setDefaultResultOrder } from "dns";
import "dotenv/config";

setDefaultResultOrder("ipv4first");

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB Error:", error);
        process.exit(1);// 1 means exit with failure
    }
};