import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./src/routes/product.routes.js"

export const app = express();

dotenv.config();
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

// Gracefully handle errors from malformed JSON
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: "Invalid JSON formatting in request body." });
    }
    next();
});


mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});