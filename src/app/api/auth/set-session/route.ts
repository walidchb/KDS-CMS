import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email } = await req.json();

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");

  const token = jwt.sign({ email }, secret, { expiresIn: "1h" });

  (await cookies()).set("auth_token", token, { httpOnly: true, path: "/" });

  return NextResponse.json({ success: true });
}
