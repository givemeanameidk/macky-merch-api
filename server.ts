import express from "express";
import { join } from "path";

const app = express();
const PORT = process.env.port || 3000;

// Default route 
app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "public", "index.html"));
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});