"use server";
import {
  getOrderById,
  getOrderStatus,
  getDistributionImg,
} from "@/lib/api/order/orderApi";
import React from "react";
import BulkSummaryTable from "../components/BulkSummaryTable";
import PalletSummaryTable from "../components/PalletSummaryTable";
import { Image } from "@mantine/core";

type PageParams = {
  params: Promise<{ orderId: string }>;
};

export default async ({ params }: PageParams) => {
  const { orderId } = await params;

  const order = await getOrderById(orderId);
  const status = await getOrderStatus(orderId);
  const image = await getDistributionImg(orderId);
  console.log(status);

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-40 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 ">Order Details</h1>
          <p className="text-gray-500  mt-1">Order {orderId}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white  p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900  mb-4">
                Order Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <p className="text-gray-500 ">Order Date</p>
                  <p className="font-medium text-gray-800 ">
                    {order.data.createdAt}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 ">Total Amount</p>
                  <p className="font-medium text-gray-800 ">
                    {order.data.amount}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 ">Source Address</p>
                  <p className="font-medium text-gray-800 ">
                    {order.data.fromAddress}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 ">Destiny Address</p>
                  <p className="font-medium text-gray-800 ">
                    {order.data.toAddress}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 ">Peso total</p>
                  <p className="font-medium text-gray-800 ">
                    {order.data.totalWeight}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 ">Volumen total</p>
                  <p className="font-medium text-green-600 ">
                    {order.data.totalVolume}
                  </p>
                </div>
              </div>
            </div>
            {order.data.orderType !== "BULK" ? (
              <div className="bg-white  p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900  mb-4">
                  Distribucion del camion
                </h3>
                <div className="overflow-x-auto">
                  <Image
                    style={{ borderColor: "black", borderWidth: "1px" }}
                    src={image ? `data:image/png;base64,${image}` : ""}
                    h={300}
                    w="auto"
                    fit="contain"
                  />
                </div>
              </div>
            ) : null}
            <div className="bg-white  p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900  mb-4">
                Camión y Chofer
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-gray-700  mb-3">
                    Información del Camión
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm bg-gray-50  p-4 rounded">
                    <div>
                      <p className="text-gray-500 ">Placa</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.truck.licensePlate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 ">Estado</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.truck.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 ">Volumen (m³)</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.truck.volume}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 ">Peso (kg)</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.truck.weight}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 ">Área (m²)</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.truck.area}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 ">Dimensiones</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.truck.length}m × {order.data.truck.width}m ×{" "}
                        {order.data.truck.height}m
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700  mb-3">
                    Información del Chofer
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm bg-gray-50  p-4 rounded">
                    <div>
                      <p className="text-gray-500 ">Nombre Completo</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.driver.firstName}{" "}
                        {order.data.driver.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 ">DNI</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.driver.dni}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 ">Teléfono</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.driver.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 ">Email</p>
                      <p className="font-medium text-gray-800 ">
                        {order.data.driver.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white  p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900  mb-4">
                Paquetes
              </h3>
              <div className="overflow-x-auto">
                {order.data.orderType === "BULK" ? (
                  <BulkSummaryTable bulk={order.data.packages} />
                ) : (
                  <PalletSummaryTable pallets={order.data.packages} />
                )}

                {/* <table className="w-full text-sm">
                  <thead className="text-left text-gray-500 ">
                    <tr>
                      <th className="p-3 font-medium">Item</th>
                      <th className="p-3 font-medium text-center">Quantity</th>
                      <th className="p-3 font-medium text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                    {order.data.items.map((item) => {
                      return (
                        <tr>
                          <td className="p-3 font-medium text-gray-800 ">
                            Running Shoes
                          </td>
                          <td className="p-3 text-center text-gray-600 ">1</td>
                          <td className="p-3 text-right text-gray-600 ">
                            $80.00
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className="p-3 font-medium text-gray-800 ">
                        Sports Socks
                      </td>
                      <td className="p-3 text-center text-gray-600 ">2</td>
                      <td className="p-3 text-right text-gray-600 ">$22.50</td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white  p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900  mb-6">
                Estado del transporte
              </h3>
              <div className="relative">
                <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-gray-200 "></div>
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="z-10 flex-shrink-0 size-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-base">
                        {" "}
                        check{" "}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-primary">Pendiente</p>
                      <p className="text-sm text-gray-500 ">
                        {new Date(order.data.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="z-10 flex-shrink-0 size-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-base">
                        {" "}
                        local_shipping{" "}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-primary">Recogido</p>
                      <p className="text-sm text-gray-500 ">
                        {order.data.pickupDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="z-10 flex-shrink-0 size-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-base">
                        {" "}
                        package_2{" "}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-primary">En camino</p>
                      <p className="text-sm text-gray-500 ">July 20, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="z-10 flex-shrink-0 size-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-base">
                        {" "}
                        package_2{" "}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-primary">Entregado</p>
                      <p className="text-sm text-gray-500 ">July 20, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
