"use client";

import { useEffect } from "react";
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
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <p className="text-blue-100">Sistema de Gestión de Camiones</p>
        </div>

        <div className="flex flex-col items-center gap-4 px-6 py-8">
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
        </div>

        <div className="flex flex-col gap-3 px-6 pb-6">
          <button
            onClick={reset}
            className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-md"
          >
            Reintentar
          </button>
          <Link
            href="/login"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors text-center"
          >
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
