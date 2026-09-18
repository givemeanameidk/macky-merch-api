import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./src/routes/product.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.port || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/macky-merch-api";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", productRoutes);

// Default route 
app.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome to the Macky Merch API!" });
});


mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});