import "dotenv/config";
import express from "express";
import notesRouter from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import ratelimit from "./config/upstash.js";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin: "http://localhost:5173"
    }));
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", notesRouter);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"))
    })
}

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
});