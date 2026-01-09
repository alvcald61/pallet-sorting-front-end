import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Endpoint API para obtener la sesión del usuario
 * Validar y devolver token + información básica
 */
export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    // Validar el token con el backend
    const validateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/validate`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!validateResponse.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ token, isValid: true }, { status: 200 });
  } catch (error) {
    console.error("Session endpoint error:", error);
    return NextResponse.json(
      { error: "Session validation failed" },
      { status: 500 }
    );
  }
}
