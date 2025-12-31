import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware mejorado con RBAC
 * Valida que el usuario tenga sesión válida
 * Las validaciones de roles específicos pueden hacerse en los layouts/páginas
 */
export default async function roleValidation(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = (await cookies()).get("session")?.value;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/sign-up", "/sign-in"];
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Si está en login y ya tiene sesión, redirige a /order
  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/order", req.url));
  }

  // Si intenta acceder a una ruta protegida sin sesión
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Opcional: Validar que el token no esté expirado
  if (token) {
    try {
      const validateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/validate`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Si el token no es válido, limpia la cookie y redirige a login
      if (!validateResponse.ok) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("session");
        return response;
      }
    } catch (error) {
      console.error("Error validating token:", error);
      // En caso de error, permiti el paso pero el contexto manejará la redirección
    }
  }

  return NextResponse.next();
}
