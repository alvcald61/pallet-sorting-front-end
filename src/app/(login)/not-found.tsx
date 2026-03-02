import Link from "next/link";

export default function LoginNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">TUPACK</h1>
          <p className="text-blue-100">Sistema de Gestión de Camiones</p>
        </div>

        <div className="flex flex-col items-center gap-4 px-6 py-8">
          <span className="text-7xl font-bold text-gray-300">404</span>
          <h2 className="text-xl font-semibold text-gray-800">
            Página no encontrada
          </h2>
          <p className="text-sm text-gray-600 text-center">
            La página que buscas no existe o fue movida.
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
