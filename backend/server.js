import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clearWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.routes.js";

connectDB();
connectCloudinary();

const App = express();
App.use(cors());

// middleware
App.use(express.json());
App.use(clerkMiddleware());

// API to listen clerk Webhooks
App.post("/api/clerk", clearWebhooks);

App.get("/", (req, res) => {
  res.send("API is running.");
});

App.use("/api/user", userRouter);
App.use("/api/hotels", hotelRouter);
App.use("/api/rooms", roomRouter);
App.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 8080;

App.listen(PORT, () => console.log(`Server running on port ${PORT}`));
