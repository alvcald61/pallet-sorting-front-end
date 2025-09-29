import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function roleValidation(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = (await cookies()).get("session")?.value;
  console.log({ path, token });

  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/order", req.url));
  }

  return NextResponse.next();
}
