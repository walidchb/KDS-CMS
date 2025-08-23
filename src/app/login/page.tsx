"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import LogoKdsNavBarWeb from "@/assets/svg/LogoKdsNavBarWeb.svg";
import { useState } from "react";

export default function LoginPage() {
  const { email, otp, otpSent, setOtp, setOtpSent } = useAuthStore();
  const [loadingSendOtp, setloadingSendOtp] = useState(false);
  const sendOtp = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    setloadingSendOtp(true);

    await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp: generatedOtp }),
      headers: { "Content-Type": "application/json" },
    });

    setOtpSent(true);
    setloadingSendOtp(false);
  };

  const verifyOtp = async (inputOtp: string) => {
    if (otp !== inputOtp) {
      alert("Invalid OTP");
      return;
    }

    // OTP matches → create session
    const res = await fetch("/api/auth/set-session", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      window.location.href = "/products";
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen px-8 pb-20 pt-16 gap-12 sm:px-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      {/* KDS Logo */}
      <LogoKdsNavBarWeb />

      <div className="flex flex-col items-center ">
        {!otpSent ? (
          <button
            disabled={loadingSendOtp}
            onClick={sendOtp}
            className={`px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors ${
              loadingSendOtp ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingSendOtp ? "Envoi..." : "Envoyer OTP"}
          </button>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <p className="mb-4 text-green-600 font-semibold">
              OTP envoyé à {email}
            </p>
            <input
              onChange={(e) => verifyOtp(e.target.value)}
              placeholder="Entrez OTP"
              className="border p-2 border-gray-500 rounded mb-4 text-black"
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
