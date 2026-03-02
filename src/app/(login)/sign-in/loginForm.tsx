"use client";
import React, { useActionState, useEffect } from "react";
import { login } from "../login/action";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/");
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {/* Background decoration */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-50 opacity-70 blur-3xl" />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500" />

          <div className="px-8 pt-8 pb-10">
            {/* Logo section */}
            <div className="flex flex-col items-center mb-8">
              <div className="mb-4">
                <img
                  src="https://pub-3e4e7b08a6f24f119bf4af2ee63c8adf.r2.dev/tupack-logo.svg"
                  alt="TUPACK Logo"
                  className="h-14 w-auto"
                />
              </div>
              <div className="w-12 h-px bg-gray-200 my-1" />
              <p className="text-sm text-gray-500 mt-2">
                Accede a tu cuenta para continuar
              </p>
            </div>

            {/* Form */}
            <form action={formAction} className="flex flex-col gap-5">
              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoFocus
                  placeholder="usuario@empresa.com"
                  className="flex h-11 w-full rounded-lg border bg-gray-50 px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-gray-200 focus:bg-white focus:border-teal-400 focus:ring-teal-400/20"
                />
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="flex h-11 w-full rounded-lg border bg-gray-50 px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-gray-200 focus:bg-white focus:border-teal-400 focus:ring-teal-400/20"
                />
              </div>

              {/* Error message */}
              {state?.error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {state.error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full h-11 mt-1 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold rounded-lg shadow-sm shadow-teal-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  "Ingresar"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} TUPACK · Sistema de Gestión de Pallets
        </p>
      </div>
    </div>
  );
}
