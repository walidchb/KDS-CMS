import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  const fixedEmail = "walidchebbab2001@gmail.com";
  if (email !== fixedEmail) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Configure mail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"OTP Auth" <${process.env.SMTP_USER}>`,
    to: fixedEmail,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  });

  return NextResponse.json({ success: true });
}
