import "dotenv/config";
import express from "express";
import notesRouter from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import ratelimit from "./config/upstash.js";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

const app = express();





// middleware
app.use(cors(
    {
        origin:"http://localhost:5173"
    }
));
app.use(express.json()) // THis middleware will parse JSON bodies: req.body
app.use(rateLimiter);

// simple custom middleware
// app.use((req,res,next) => {
//     console.log(`Req methon is ${req.method} & Req URL is ${req.url}`);
//     next();
// })

app.use("/api/notes", notesRouter);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
});
