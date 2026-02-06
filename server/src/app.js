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

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

/* =======================
   ✅ CORS CONFIG (FIXED)
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://productr-assignment-zeks.vercel.app", // ✅ NO trailing slash
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS not allowed for origin: " + origin)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ VERY IMPORTANT (preflight support)
app.options("*", cors());

/* =======================
   RATE LIMIT (AUTH)
======================= */
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
  })
);

/* =======================
   STATIC UPLOADS
======================= */
const uploadDir = process.env.UPLOAD_DIR || "uploads";
const absUploads = path.join(process.cwd(), "server", uploadDir);
app.use("/uploads", express.static(absUploads));

/* =======================
   ROUTES
======================= */
app.get("/", (req, res) => {
  res.json({ message: "Server healthy ✅" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

/* =======================
   ERROR HANDLING
======================= */
app.use(notFound);
app.use(errorHandler);

export default app;
