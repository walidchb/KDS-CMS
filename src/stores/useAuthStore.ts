import { create } from "zustand";

type AuthState = {
  email: string;
  otp: string;
  otpSent: boolean;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  setOtpSent: (sent: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  email: "walidchebbab2001@gmail.com", // fixed
  otp: "",
  otpSent: false,
  setEmail: (email) => set({ email }),
  setOtp: (otp) => set({ otp }),
  setOtpSent: (otpSent) => set({ otpSent }),
}));
