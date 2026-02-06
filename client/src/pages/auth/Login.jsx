
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import runnerImg from "../../assets/runner.jpg"; // ✅ put your image here

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return toast.error("Email or Phone is required");

    try {
      setLoading(true);
      const res = await api.post("/api/auth/request-otp", { identifier });
      toast.success(res.data?.message || "OTP sent");
      localStorage.setItem("identifier", identifier.trim());
      navigate("/otp");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Figma gradient (exact colors you showed)
  const leftPanelBg = {
    background: `
      radial-gradient(900px 700px at 10% 15%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%),
      radial-gradient(800px 600px at 85% 55%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%),
      radial-gradient(800px 700px at 30% 90%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 55%),
      linear-gradient(180deg,
        rgba(1, 8, 96, 1) 0%,
        rgba(0, 34, 131, 1) 35%,
        rgba(115, 74, 163, 1) 60%,
        rgba(231, 149, 156, 1) 78%,
        rgba(228, 161, 130, 1) 90%,
        rgba(191, 54, 19, 1) 100%
      )
    `,
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-4">
      <div className="w-full max-w-[1100px] bg-white rounded-[28px] overflow-hidden shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
        <div className="grid md:grid-cols-2 min-h-[660px]">
          {/* ✅ LEFT SIDE (gradient + center phone image) */}
          <div className="relative p-8 md:p-10" style={leftPanelBg}>
            {/* top-left logo */}
            <div className="relative z-10 flex items-center gap-2">
              <div className="text-[#0b157a] font-extrabold text-lg tracking-tight">
                Productr
              </div>
              <span className="inline-flex w-5 h-5 rounded-full bg-[#ff7a59]" />
            </div>

            {/* center phone */}
            <div className="relative z-10 mt-12 md:mt-16 flex justify-center">
              <div className="relative w-[310px] h-[460px] rounded-[34px] overflow-hidden shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
                {/* phone background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#ffd16f] via-[#ff8b3f] to-[#2b0f0a]" />

                {/* runner image (center) */}
                <img
                  src={runnerImg}
                  alt="runner"
                  className="absolute inset-0 w-full h-full object-cover opacity-95"
                />

                {/* bottom dark fade */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/45" />

                {/* bottom text */}
                <div className="absolute bottom-10 left-0 right-0 text-center">
                  <p className="text-white text-sm font-semibold leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                    Uplist your <br /> product to market
                  </p>
                </div>

                {/* subtle border glow */}
                <div className="absolute inset-0 rounded-[34px] ring-2 ring-white/25" />
              </div>
            </div>

            {/* soft bottom glow like figma */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/20 blur-2xl" />
          </div>

          {/* ✅ RIGHT SIDE (login form) */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-center font-semibold text-[18px] text-gray-800">
              Login to your <span className="text-[#0b157a]">Productr</span> Account
            </h2>

            <form onSubmit={onSubmit} className="mt-8 mx-auto w-full max-w-md space-y-4">
              <div className="text-xs font-medium text-gray-700">
                Email or Phone number
              </div>

              <Input
                placeholder="Enter email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-10 rounded-md"
              />

              <Button
                disabled={loading}
                className="w-full h-10 rounded-md bg-[#0b157a] text-white hover:bg-[#0a136a]"
              >
                {loading ? "Sending OTP..." : "Login"}
              </Button>
            </form>

            {/* bottom signup dashed box */}
            <div className="mt-20 flex justify-center">
              <div className="w-full max-w-xs border border-dashed border-gray-300 rounded-md p-4 text-center text-[11px] text-gray-500">
                Don’t have a Productr Account <br />
                <span className="text-[#0b157a] font-semibold cursor-pointer">
                  SignUp Here
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
