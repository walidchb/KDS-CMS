import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function verifyJWT(token: string, secret: string) {
  const encoder = new TextEncoder();
  try {
    const { payload } = await jwtVerify(
      token,
      encoder.encode(secret)
    );
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  // Protect these routes
  if (
    req.nextUrl.pathname.startsWith("/products") ||
    req.nextUrl.pathname.startsWith("/customImages") ||
    req.nextUrl.pathname.startsWith("/categories")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");

    const valid = await verifyJWT(token, secret);
    if (!valid) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/customImages/:path*", "/categories/:path*"],
};
