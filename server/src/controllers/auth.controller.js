import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../config/sendgrid.js";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^[0-9]{10,15}$/.test(v);

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

// POST /api/auth/request-otp
export const requestOtp = asyncHandler(async (req, res) => {
  const { identifier } = req.body;

  if (!identifier) {
    res.status(400);
    throw new Error("Email or Phone is required");
  }

  const trimmed = String(identifier).trim();
  if (!isEmail(trimmed) && !isPhone(trimmed)) {
    res.status(400);
    throw new Error("Enter valid Email or Phone number");
  }

  // rate limit like behavior: allow new otp anytime but overwrites previous
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expMin = Number(process.env.OTP_EXP_MIN || 5);
  const otpExpiresAt = new Date(Date.now() + expMin * 60 * 1000);

  const payload = {
    identifier: trimmed,
    email: isEmail(trimmed) ? trimmed : null,
    phone: isPhone(trimmed) ? trimmed : null,
    otpHash,
    otpExpiresAt
  };

  const user = await User.findOneAndUpdate(
    { identifier: trimmed },
    { $set: payload },
    { new: true, upsert: true }
  );

  // Send OTP
  if (user.email) {
    await sendOtpEmail({ to: user.email, otp });
  } else {
    // Phone OTP needs SMS provider (Twilio/Fast2SMS).
    // For assignment: allow dev to return otp for testing.
    console.warn("⚠️ Phone OTP requested. Use SMS provider in production.");
  }

  const devReturn = String(process.env.DEV_RETURN_OTP || "false") === "true";

  return res.status(200).json({
    message: "OTP sent",
    ...(devReturn ? { otp } : {})
  });
});

// POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { identifier, otp } = req.body;

  if (!identifier || !otp) {
    res.status(400);
    throw new Error("Identifier and OTP are required");
  }

  const user = await User.findOne({ identifier: String(identifier).trim() });
  if (!user) {
    res.status(400);
    throw new Error("User not found. Request OTP again.");
  }

  if (!user.otpHash || !user.otpExpiresAt) {
    res.status(400);
    throw new Error("OTP not requested. Please request OTP again.");
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    res.status(400);
    throw new Error("OTP expired. Please resend OTP.");
  }

  const incomingHash = hashOtp(String(otp).trim());
  if (incomingHash !== user.otpHash) {
    res.status(400);
    throw new Error("Please enter a valid OTP");
  }

  user.isVerified = true;
  user.otpHash = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    message: "Login success",
    token,
    user: {
      id: user._id,
      identifier: user.identifier,
      email: user.email,
      phone: user.phone
    }
  });
});

// GET /api/auth/me (protected)
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-otpHash -otpExpiresAt");
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  res.json({ user });
});
