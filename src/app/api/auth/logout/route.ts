import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Delete cookie by setting it to empty with expired date
  (await
        // Delete cookie by setting it to empty with expired date
        cookies()).set("auth_token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return NextResponse.json({ success: true });
}
