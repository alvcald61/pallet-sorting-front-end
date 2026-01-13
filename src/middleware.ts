import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function roleValidation(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = (await cookies()).get("session")?.value;

  if (path === "/login" && token) {
    console.log("Redirecting to /order since user is already authenticated");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
