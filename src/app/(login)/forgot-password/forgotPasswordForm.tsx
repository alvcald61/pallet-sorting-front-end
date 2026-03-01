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
import { forgotPassword } from "./action";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPassword, undefined);
  const [email, setEmail] = useState("");

  const emailError = email && !isValidEmail(email);

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
              Correo enviado
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Si el correo está registrado, recibirás un enlace para
              restablecer tu contraseña. Revisa tu bandeja de entrada y la
              carpeta de spam.
            </p>
          </CardContent>

          <CardFooter className="flex justify-center">
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <CardDescription className="text-blue-100">
            Sistema de Gestión de Camiones
          </CardDescription>
          <h2 className="text-xl font-semibold mt-4">Recuperar contraseña</h2>
        </CardHeader>

        <form action={formAction} className="w-full">
          <CardContent className="flex flex-col gap-5 py-6">
            {state?.error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            <p className="text-sm text-gray-600">
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </p>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-gray-700">
                Correo electrónico
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className={`h-10 pl-10 ${emailError ? "border-red-500" : ""}`}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {emailError && (
                <p className="text-xs text-red-500">Ingresa un correo válido</p>
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
          Enviando...
        </span>
      ) : (
        "Enviar enlace de recuperación"
      )}
    </Button>
  );
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
