"use client";

import React, { useActionState } from "react";
import { resetPasswordAction } from "./action";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, formAction] = useActionState(resetPasswordAction, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDontMatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-6 rounded-t-lg">
            <h1 className="text-3xl font-bold">TUPACK</h1>
            <p className="text-blue-100 text-sm">
              Sistema de Gestión de Camiones
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 px-6 py-8">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Enlace inválido
            </h2>
            <p className="text-sm text-gray-600 text-center">
              El enlace de recuperación es inválido o ha expirado. Por favor,
              solicita uno nuevo.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-center px-6 pb-6">
            <Link
              href="/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Solicitar nuevo enlace
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-6 rounded-t-lg">
            <h1 className="text-3xl font-bold">TUPACK</h1>
            <p className="text-blue-100 text-sm">
              Sistema de Gestión de Camiones
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 px-6 py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Contraseña actualizada
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Tu contraseña ha sido restablecida correctamente. Ya puedes
              iniciar sesión con tu nueva contraseña.
            </p>
          </div>

          <div className="flex justify-center px-6 pb-6">
            <Link
              href="/login"
              className="w-full"
            >
              <button className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-md">
                Ir a iniciar sesión
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <p className="text-blue-100 text-sm">
            Sistema de Gestión de Camiones
          </p>
          <h2 className="text-xl font-semibold mt-4">
            Restablecer contraseña
          </h2>
        </div>

        <form action={formAction} className="w-full">
          <input type="hidden" name="token" value={token} />

          <div className="flex flex-col gap-5 px-6 py-6">
            {state?.error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="text-xs text-red-500">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-gray-700"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                    passwordsDontMatch ? "border-red-500" : ""
                  } ${passwordsMatch ? "border-green-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordsDontMatch && (
                <p className="text-xs text-red-500">
                  Las contraseñas no coinciden
                </p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Las contraseñas coinciden
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 px-6 pb-6">
            <SubmitButton />
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Volver al login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Restableciendo...
        </span>
      ) : (
        "Restablecer contraseña"
      )}
    </button>
  );
};
