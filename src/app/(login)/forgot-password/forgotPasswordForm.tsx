"use client";

import React, { useActionState } from "react";
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
              Correo enviado
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Si el correo está registrado, recibirás un enlace para
              restablecer tu contraseña. Revisa tu bandeja de entrada y la
              carpeta de spam.
            </p>
          </div>

          <div className="flex justify-center px-6 pb-6">
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Volver al login
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
          <h2 className="text-xl font-semibold mt-4">Recuperar contraseña</h2>
        </div>

        <form action={formAction} className="w-full">
          <div className="flex flex-col gap-5 px-6 py-6">
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
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${emailError ? "border-red-500" : ""}`}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {emailError && (
                <p className="text-xs text-red-500">Ingresa un correo válido</p>
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
          Enviando...
        </span>
      ) : (
        "Enviar enlace de recuperación"
      )}
    </button>
  );
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
