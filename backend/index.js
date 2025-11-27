import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import bankerRoutes from "./routes/bankerRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://enbankingsystem.netlify.app"]
}));

app.use(express.json());

// connect DB only once
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
}

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/bankers", bankerRoutes);

app.get("/", (req, res) => {
  res.send("Banking API running");
});

export default app;
