import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { initSendGrid } from "./src/config/sendgrid.js";

const PORT = process.env.PORT || 4001;

const start = async () => {
  await connectDB();
  initSendGrid();

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

start().catch((e) => {
  console.error("❌ Failed to start server:", e.message);
  process.exit(1);
});
