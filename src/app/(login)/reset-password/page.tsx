import ResetPasswordForm from "./resetPasswordForm";
import { Suspense } from "react";

export const metadata = {
  title: "Restablecer contraseña - TUPACK",
  description: "Establece tu nueva contraseña de TUPACK",
};

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
