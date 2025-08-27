import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from '@clerk/express'
import clearWebhooks from "./controllers/clerkWebhooks.js"

connectDB()

const App = express()
App.use(cors())  // Enable cross origin resource sharing


// middleware
App.use(express.json())
App.use(clerkMiddleware())

// API to listen clerk Webhooks
App.use("/api/clerk", clearWebhooks);

App.get('/', (req, res) => {
  res.send("API is running.")
})

const PORT = process.env.PORT || 3000

App.listen(PORT, () => console.log(`Server running on port ${PORT}`))