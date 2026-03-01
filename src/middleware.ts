import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/sign-up", "/forgot-password", "/reset-password"];

export default async function roleValidation(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = (await cookies()).get("session")?.value;

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );

  // Authenticated user trying to access login → redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Unauthenticated user trying to access protected route → redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|api/).*)"],
};
