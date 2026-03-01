"use client";

import React, { useActionState, useState } from "react";
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
import { register } from "./action";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignUpForm() {
  const [state, formAction] = useActionState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    ruc: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const passwordsVisible = formData.password && formData.confirmPassword;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <CardDescription className="text-blue-100">
            Sistema de Gestión de Paletas
          </CardDescription>
          <h2 className="text-xl font-semibold mt-4">Crear nueva cuenta</h2>
          <p className="text-blue-100 text-sm mt-1">
            Regístrate para comenzar a gestionar tus pedidos
          </p>
        </CardHeader>

        <form action={formAction} className="w-full">
          <CardContent className="flex flex-col gap-6 py-6">
            {/* Error Alert */}
            {state?.error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="font-semibold text-gray-700"
                >
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="font-semibold text-gray-700"
                >
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-gray-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="empresa@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-10"
              />
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label
                htmlFor="businessName"
                className="font-semibold text-gray-700"
              >
                Razón Social
              </Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="Mi Empresa S.A.C."
                value={formData.businessName}
                onChange={handleChange}
                required
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* RUC */}
              <div className="space-y-2">
                <Label htmlFor="ruc" className="font-semibold text-gray-700">
                  RUC
                </Label>
                <Input
                  id="ruc"
                  name="ruc"
                  type="text"
                  placeholder="20123456789"
                  value={formData.ruc}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold text-gray-700">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+51 123 456 789"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="font-semibold text-gray-700">
                Dirección
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Calle Principal 123, Lima, Perú"
                value={formData.address}
                onChange={handleChange}
                required
                className="h-10"
              />
            </div>

            {/* Password */}
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
                  value={formData.password}
                  onChange={handleChange}
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
              <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
            </div>

            {/* Confirm Password */}
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
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`h-10 pr-10 ${
                    passwordsVisible && !passwordsMatch && "border-red-500"
                  }`}
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
              {passwordsVisible &&
                (passwordsMatch ? (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Las contraseñas
                    coinciden
                  </p>
                ) : (
                  <p className="text-xs text-red-600">
                    Las contraseñas no coinciden
                  </p>
                ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <SubmitButton
              disabled={Boolean(passwordsVisible && !passwordsMatch)}
            />
            <div className="w-full text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

const SubmitButton = ({ disabled }: { disabled: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending || disabled}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Registrando...
        </span>
      ) : (
        "Crear cuenta"
      )}
    </Button>
  );
};
