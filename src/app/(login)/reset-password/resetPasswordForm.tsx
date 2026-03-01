"use client";

import React, { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <h1 className="text-3xl font-bold">TUPACK</h1>
            <CardDescription className="text-blue-100">
              Sistema de Gestión de Camiones
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Enlace inválido
            </h2>
            <p className="text-sm text-gray-600 text-center">
              El enlace de recuperación es inválido o ha expirado. Por favor,
              solicita uno nuevo.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 items-center">
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
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <h1 className="text-3xl font-bold">TUPACK</h1>
            <CardDescription className="text-blue-100">
              Sistema de Gestión de Camiones
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Contraseña actualizada
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Tu contraseña ha sido restablecida correctamente. Ya puedes
              iniciar sesión con tu nueva contraseña.
            </p>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Link
              href="/login"
              className="w-full"
            >
              <Button className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold">
                Ir a iniciar sesión
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <CardDescription className="text-blue-100">
            Sistema de Gestión de Camiones
          </CardDescription>
          <h2 className="text-xl font-semibold mt-4">
            Restablecer contraseña
          </h2>
        </CardHeader>

        <form action={formAction} className="w-full">
          <input type="hidden" name="token" value={token} />

          <CardContent className="flex flex-col gap-5 py-6">
            {state?.error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-semibold text-gray-700"
              >
                Nueva contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="h-10 pr-10"
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
              <Label
                htmlFor="confirmPassword"
                className="font-semibold text-gray-700"
              >
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`h-10 pr-10 ${
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
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <SubmitButton />
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Volver al login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Restableciendo...
        </span>
      ) : (
        "Restablecer contraseña"
      )}
    </Button>
  );
};
