import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = process.env.UPLOAD_DIR || "uploads";
const absDir = path.join(process.cwd(), "server", uploadDir);

if (!fs.existsSync(absDir)) fs.mkdirSync(absDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, absDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${unique}-${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ok = ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.mimetype);
  if (!ok) return cb(new Error("Only image files are allowed"));
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB per image
});
