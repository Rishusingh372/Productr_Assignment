import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, unique: true, index: true }, // email or phone
    email: { type: String, default: null },
    phone: { type: String, default: null },

    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },

    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
