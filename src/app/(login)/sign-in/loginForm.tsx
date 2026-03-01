"use client";
import React, { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    <div className="flex min-h-screen items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center ">Iniciar sesión</h2>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="flex flex-col gap-4 mb-3">
            <div>
              <Label className="mb-3" htmlFor="email">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            {state?.error && (
              <div className="text-red-500 text-sm">{state.error}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Ingresando..." : "Ingresar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
