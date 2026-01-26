"use client";

import { Truck, Driver } from "@/lib/types/orderTypes";

interface TruckAndDriverCardProps {
  truck: Truck;
  driver: Driver;
}

export default function TruckAndDriverCard({
  truck,
  driver,
}: TruckAndDriverCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Camión y Chofer
      </h3>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Información del Camión
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm bg-gray-50 p-4 rounded">
            <div>
              <p className="text-gray-500">Placa</p>
              <p className="font-medium text-gray-800">{truck.licensePlate}</p>
            </div>
            <div>
              <p className="text-gray-500">Estado</p>
              <p className="font-medium text-gray-800">{truck.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Volumen (m³)</p>
              <p className="font-medium text-gray-800">{truck.volume}</p>
            </div>
            <div>
              <p className="text-gray-500">Peso (kg)</p>
              <p className="font-medium text-gray-800">{truck.weight}</p>
            </div>
            <div>
              <p className="text-gray-500">Área (m²)</p>
              <p className="font-medium text-gray-800">{truck.area}</p>
            </div>
            <div>
              <p className="text-gray-500">Dimensiones</p>
              <p className="font-medium text-gray-800">
                {truck.length}m × {truck.width}m × {truck.height}m
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Información del Chofer
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm bg-gray-50 p-4 rounded">
            <div>
              <p className="text-gray-500">Nombre Completo</p>
              <p className="font-medium text-gray-800">
                {driver.firstName} {driver.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-500">DNI</p>
              <p className="font-medium text-gray-800">{driver.dni}</p>
            </div>
            <div>
              <p className="text-gray-500">Teléfono</p>
              <p className="font-medium text-gray-800">{driver.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{driver.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
