"use client";

import { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Login error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <p className="text-blue-100">Sistema de Gestión de Camiones</p>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 py-8">
          <AlertCircle className="h-16 w-16 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Algo salió mal
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Ocurrió un error inesperado. Por favor, intenta de nuevo.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-400 mt-1">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={reset}
            className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
          >
            Reintentar
          </Button>
          <Link
            href="/login"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            Volver al login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
