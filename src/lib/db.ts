import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

const connectDB = async () => {
  if (!MONGO_URI) throw new Error("MONGO_URI is not defined in .env");

  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
};

export default connectDB;