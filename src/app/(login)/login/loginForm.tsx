/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getAuthToken } from "@/lib/api/auth/authApi";
import { login } from "./action";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginForm() {
  //falta manejar el error de login en state
  const [state, setActionState] = useActionState(login, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const authResponse = await getAuthToken(email, password);
      localStorage.setItem("jwt", authResponse.accessToken);
      window.location.href = "/order";
    } catch (err: any) {
      setError(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center ">Iniciar sesión</h2>
        </CardHeader>
        <form action={setActionState}>
          <CardContent className="flex flex-col gap-4 mb-3">
            <div>
              <Label className="mb-3" htmlFor="email">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </CardContent>
          <CardFooter>
            <SubmitButton loading={loading} />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

const SubmitButton = ({ loading }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {loading ? "Ingresando..." : "Ingresar"}
    </Button>
  );
};
