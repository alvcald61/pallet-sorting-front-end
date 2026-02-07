import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

export default function LoginNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <p className="text-blue-100">Sistema de Gestión de Camiones</p>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 py-8">
          <span className="text-7xl font-bold text-gray-300">404</span>
          <h2 className="text-xl font-semibold text-gray-800">
            Página no encontrada
          </h2>
          <p className="text-sm text-gray-600 text-center">
            La página que buscas no existe o fue movida.
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
