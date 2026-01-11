/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useActionState, useEffect } from "react";
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
import { login } from "./action";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Router } from "lucide-react";
import { useState } from "react";
import { getCurrentUser } from "@/lib/api/auth/userApi";
import OneSignal from "react-onesignal";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("alvarocalderom@gmail.com");
  const [password, setPassword] = useState("12345678");

  const emailError = email && !isValidEmail(email);

  // Inicializar OneSignal una sola vez
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "Initializing OneSignal",
        process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
      );

      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "",
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: true,
        },
      });
      console.log("OneSignal initialized successfully");
    }
  }, []);

  useEffect(() => {
    const registerWithOneSignal = async () => {
      // Si el estado tiene success, significa que el login fue exitoso
      if (state?.success) {
        try {
          const user = await getCurrentUser();
          if (user?.id) {
            await OneSignal.login(user.id);
            console.log(`OneSignal login successful for userId: ${user.id}`);
          }
        } catch (error) {
          console.error("Error registering with OneSignal:", error);
        } finally {
          // Navegar después de intentar registrarse en OneSignal
          router.push("/order");
        }
      }
    };

    registerWithOneSignal();
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <CardDescription className="text-blue-100">
            Sistema de Gestión de Camiones
          </CardDescription>
          <h2 className="text-xl font-semibold mt-4">Iniciar sesión</h2>
        </CardHeader>

        <form action={formAction} className="w-full">
          <CardContent className="flex flex-col gap-5 py-6">
            {/* Error Alert */}
            {state?.error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-gray-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className={`h-10 ${emailError ? "border-red-500" : ""}`}
              />
              {emailError && (
                <p className="text-xs text-red-500">Ingresa un correo válido</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <SubmitButton />
            <div className="w-full text-center text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/sign-up"
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Regístrate aquí
              </Link>
            </div>
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
          Ingresando...
        </span>
      ) : (
        "Ingresar"
      )}
    </Button>
  );
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
