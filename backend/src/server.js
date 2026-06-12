import "dotenv/config";
import express from "express";
import notesRouter from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { clerkClient, clerkMiddleware, requireAuth } from "@clerk/express";

const app = express();
const __filename = fileURLToPath(import.meta.url); //It recreates standard path shortcuts
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    "http://localhost:5173",        
    "https://mern-thinkboard-jqnj.onrender.com"  
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']     
}));

app.options('*', cors()); 
app.use(express.json()); 

// Manual JWT verification middleware through clerk
app.use(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    const { verifyToken } = await import('@clerk/backend');
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    req.auth = { userId: payload.sub };
    console.log("✅ Auth verified, userId:", payload.sub);
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    next();
  }
});

app.use(rateLimiter);

// Protected Routes — manual auth check
app.use("/api/notes", (req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}, notesRouter);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../../frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"))
    })
}

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port: ${process.env.PORT}`);
    });
});