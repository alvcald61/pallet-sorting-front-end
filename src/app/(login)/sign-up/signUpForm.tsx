"use client";

import React, { useActionState, useState } from "react";
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
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <p className="text-blue-100 text-sm">
            Sistema de Gestión de Paletas
          </p>
          <h2 className="text-xl font-semibold mt-4">Crear nueva cuenta</h2>
          <p className="text-blue-100 text-sm mt-1">
            Regístrate para comenzar a gestionar tus pedidos
          </p>
        </div>

        <form action={formAction} className="w-full">
          <div className="flex flex-col gap-6 px-6 py-6">
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
                <label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Nombre
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="empresa@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <label
                htmlFor="businessName"
                className="text-sm font-semibold text-gray-700"
              >
                Razón Social
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="Mi Empresa S.A.C."
                value={formData.businessName}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* RUC */}
              <div className="space-y-2">
                <label htmlFor="ruc" className="text-sm font-semibold text-gray-700">
                  RUC
                </label>
                <input
                  id="ruc"
                  name="ruc"
                  type="text"
                  placeholder="20123456789"
                  value={formData.ruc}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+51 123 456 789"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-semibold text-gray-700">
                Dirección
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Calle Principal 123, Lima, Perú"
                value={formData.address}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
              <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
            </div>

            {/* Confirm Password */}
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
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
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
          </div>

          <div className="flex flex-col gap-3 px-6 pb-6">
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
          </div>
        </form>
      </div>
    </div>
  );
}

const SubmitButton = ({ disabled }: { disabled: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending || disabled}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Registrando...
        </span>
      ) : (
        "Crear cuenta"
      )}
    </button>
  );
};
