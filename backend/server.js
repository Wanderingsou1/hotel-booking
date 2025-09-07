import express from "express";
import "dotenv/config";
import cors from "cors";
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

// --- CORS Middleware (must be first) ---
App.use(
  cors({
    origin: [
      "https://avista-gold.vercel.app", // your frontend
      "http://localhost:5173"           // add local dev if needed
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Handle preflight requests
// App.options("*", cors());

// --- Body parser ---
App.use(express.json());

// --- Clerk middleware ---
App.use(clerkMiddleware());

// --- Webhook route ---
App.post("/api/clerk", clearWebhooks);

// --- Test route ---
App.get("/", (req, res) => res.send("API is running."));

// --- API routes ---
App.use("/api/user", userRouter);
App.use("/api/hotels", hotelRouter);
App.use("/api/rooms", roomRouter);
App.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 8080;
App.listen(PORT, () => console.log(`Server running on port ${PORT}`));
