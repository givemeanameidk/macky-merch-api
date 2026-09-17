import express from "express";
import { join } from "path";
import productRoutes from "./src/routes/product.routes.js"

const app = express();
const PORT = process.env.port || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Default route 
app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "public", "index.html"));
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});