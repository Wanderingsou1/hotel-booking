import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; // already connected
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "hotel-booking",
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

export default connectDB;
