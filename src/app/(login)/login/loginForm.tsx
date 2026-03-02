/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useActionState, useEffect, useState } from "react";
import { login } from "./action";
import { useFormStatus } from "react-dom";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailError = email && !isValidEmail(email);

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
              {/* Error Alert */}
              {state?.error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Email Field */}
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
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className={`flex h-11 w-full rounded-lg border bg-gray-50 px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-gray-200 focus:bg-white focus:border-teal-400 focus:ring-teal-400/20 ${
                    emailError ? "border-red-400" : ""
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-500">
                    Ingresa un correo válido
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex h-11 w-full rounded-lg border bg-gray-50 px-3 py-1 pr-10 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-gray-200 focus:bg-white focus:border-teal-400 focus:ring-teal-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <SubmitButton />
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

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full h-11 mt-1 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold rounded-lg shadow-sm shadow-teal-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Ingresando...
        </span>
      ) : (
        "Ingresar"
      )}
    </button>
  );
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
