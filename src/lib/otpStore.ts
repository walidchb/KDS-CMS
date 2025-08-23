// src/lib/otpStore.ts
const otpStore: Record<string, string> = {};

export function setOtp(email: string, otp: string) {
    console.log("saved",email, otp);
  otpStore[email] = otp;
}

export function getOtp(email: string) {
    console.log("getting otp", email);
    console.log("from store", otpStore[email]);
    console.log("otpStore", otpStore);
  return otpStore[email];
}

export function deleteOtp(email: string) {
  delete otpStore[email];
}
