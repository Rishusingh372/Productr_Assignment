import crypto from "crypto";

export const generateOtp = () => {
  // 6 digits
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const hashOtp = (otp) => {
  const secret = process.env.JWT_SECRET || "fallback_secret";
  return crypto.createHmac("sha256", secret).update(otp).digest("hex");
};
