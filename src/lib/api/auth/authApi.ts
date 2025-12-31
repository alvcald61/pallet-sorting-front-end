import { LoginResponse } from "@/lib/types/authTypes";

export const getAuthToken = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  console.log(process.env.NEXT_PUBLIC_BACKEND_HOST);
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_HOST + "/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!res.ok) throw new Error("Credenciales incorrectas");
  const data: LoginResponse = await res.json();
  return data;
};
