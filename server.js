import dotenv from "dotenv";
dotenv.config();

import mqtt from "mqtt";
import fs from "fs";
import path from "path";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import mongoose from "mongoose";
import cors from "cors";

import SensorData from "./models/SensorData.js";
import sensorRoutes from "./routes/sensors.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

const app = express();
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sensors", sensorRoutes);

app.use(express.static("public"));

// WebSocket connection
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

const PORT = process.env.PORT || 5000;

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Start server ONLY after MongoDB connects
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
