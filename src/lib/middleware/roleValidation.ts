import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function roleValidation(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = (await cookies()).get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}