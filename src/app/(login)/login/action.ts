"use server";

import { getAuthToken } from "@/lib/api/auth/authApi";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(prevState: any, formData: FormData) {
  // falta validar email y password
  console.log(formData);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const authResponse = await getAuthToken(email, password);
  // falta agregar la expiracion expires: ...

  (await cookies()).set("session", authResponse.accessToken, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 3600 * 1000),
  });

  redirect("/order");
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/login");
}
