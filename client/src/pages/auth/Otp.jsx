
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { useAuth } from "../../state/AuthContext";

import runnerImg from "../../assets/runner.jpg";

export default function Otp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const inputsRef = useRef([]);

  const identifier = localStorage.getItem("identifier") || "";

  useEffect(() => {
    if (!identifier) navigate("/login");
    inputsRef.current?.[0]?.focus?.();
  }, [identifier, navigate]);

  const handleChange = (i, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[i] = value.slice(-1);
    setOtp(next);
    setErrMsg("");

    if (value && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (otp[i]) {
        const next = [...otp];
        next[i] = "";
        setOtp(next);
        return;
      }
      if (i > 0) inputsRef.current[i - 1]?.focus();
    }
  };

  const submit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setErrMsg("Please enter a valid OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/api/auth/verify-otp", { identifier, otp: code });
      toast.success("Login success");
      login(res.data.token, res.data.user);
      navigate("/dashboard/home");
    } catch (e) {
      setErrMsg(e?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      const res = await api.post("/api/auth/request-otp", { identifier });
      toast.success(res.data?.message || "OTP resent");
      setOtp(Array(6).fill(""));
      setErrMsg("");
      inputsRef.current?.[0]?.focus?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to resend OTP");
    }
  };

  // ✅ Same gradient as Login
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
          {/* ✅ LEFT (same as login) */}
          <div className="relative p-8 md:p-10" style={leftPanelBg}>
            <div className="relative z-10 flex items-center gap-2">
              <div className="text-[#0b157a] font-extrabold text-lg tracking-tight">
                Productr
              </div>
              <span className="inline-flex w-5 h-5 rounded-full bg-[#ff7a59]" />
            </div>

            <div className="relative z-10 mt-12 md:mt-16 flex justify-center">
              <div className="relative w-[310px] h-[460px] rounded-[34px] overflow-hidden shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#ffd16f] via-[#ff8b3f] to-[#2b0f0a]" />
                <img
                  src={runnerImg}
                  alt="runner"
                  className="absolute inset-0 w-full h-full object-cover opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/45" />

                <div className="absolute bottom-10 left-0 right-0 text-center">
                  <p className="text-white text-sm font-semibold leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                    Uplist your <br /> product to market
                  </p>
                </div>

                <div className="absolute inset-0 rounded-[34px] ring-2 ring-white/25" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/20 blur-2xl" />
          </div>

          {/* ✅ RIGHT (OTP UI same spacing like figma) */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-center font-semibold text-[18px] text-gray-800">
              Login to your <span className="text-[#0b157a]">Productr</span> Account
            </h2>

            <div className="mt-8 mx-auto w-full max-w-md">
              <div className="text-xs text-gray-700 font-medium mb-2">Enter OTP</div>

              <div className="flex gap-2">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    value={v}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={
                      "w-11 h-11 border rounded-xl text-center text-[16px] font-semibold " +
                      "outline-none focus:ring-2 focus:ring-blue-600/30 " +
                      (errMsg ? "border-red-400" : "border-gray-200")
                    }
                    maxLength={1}
                    inputMode="numeric"
                  />
                ))}
              </div>

              {errMsg && <div className="text-xs text-red-500 mt-2">{errMsg}</div>}

              <Button
                onClick={submit}
                disabled={loading}
                className="w-full mt-5 h-10 rounded-md bg-[#0b157a] text-white hover:bg-[#0a136a]"
              >
                {loading ? "Verifying..." : "Enter your OTP"}
              </Button>

              <div className="mt-3 text-xs text-gray-500 text-center">
                Didn’t receive OTP ?{" "}
                <span
                  onClick={resend}
                  className="text-[#0b157a] font-semibold cursor-pointer"
                >
                  Resend
                </span>
              </div>
            </div>

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
