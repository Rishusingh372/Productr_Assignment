import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Basic limiter (auth abuse protection)
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 60 * 1000,
    max: 30
  })
);

// Serve uploads static
const uploadDir = process.env.UPLOAD_DIR || "uploads";
const absUploads = path.join(process.cwd(), "server", uploadDir);
app.use("/uploads", express.static(absUploads));

app.get("/", (req, res) => {
  res.json({ message: "Server healthy ✅" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
