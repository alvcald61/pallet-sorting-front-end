"use client";
import React, { useEffect, useState } from "react";

import { Tabs } from "@mantine/core";

import { BulkForm } from "../../components/bulkForm";
import useOrderStore from "@/lib/store/OrderStore";
import { Card, TextInput, Text, Badge, Button, Group } from "@mantine/core";
import { FaBox } from "react-icons/fa";
import { PalletForm } from "../../components/palletForm";

const Page = () => {
  const { bulkOrder, address, palletOrder } = useOrderStore();

  useEffect(() => {
    console.log("bulkOrder", bulkOrder);
    console.log("address", address);
  }, [address, bulkOrder]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex flex-col items-stretch justify-start rounded-xl bg-white  shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 ">
              <p className="text-[#212529]  text-lg font-bold leading-tight tracking-[-0.015em]">
                Shipping Details
              </p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="flex flex-col gap-1">
                <p className="text-gray-500  text-sm font-normal leading-normal">
                  Direccion de recojo
                </p>
                <p className="text-[#212529]  text-sm font-normal leading-normal">
                  {`${address.fromAddress.address},  ${address.fromAddress.district}, ${address.fromAddress.city}, ${address.fromAddress.state}`}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-gray-500  text-sm font-normal leading-normal">
                  Direccion de destino
                </p>
                <p className="text-[#212529]  text-sm font-normal leading-normal">
                  {`${address.toAddress.address}, ${address.toAddress.city}, ${address.toAddress.city}, ${address.toAddress.state}`}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-gray-500  text-sm font-normal leading-normal">
                  Fecha de recojo
                </p>
                <p className="text-[#212529]  text-sm font-normal leading-normal">
                  {address.date} {address.time}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch justify-start rounded-xl bg-white  shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 ">
              <p className="text-[#212529]  text-lg font-bold leading-tight tracking-[-0.015em]">
                Detalle de carga
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500  uppercase bg-gray-50 ">
                  <tr>
                    <th className="px-6 py-3 text-center" scope="col">
                      Size
                    </th>
                    <th className="px-6 py-3 text-center" scope="col">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-right" scope="col">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {palletOrder.map((item, index) => {
                    return (
                      <tr className="bg-white  border-b ">
                        <td className="px-6 py-4 text-center">{`${item.width} x ${item.length} x ${item.height}`}</td>
                        <td className="px-6 py-4 text-center">{`${item.weight} kg`}</td>
                        <td className="px-6 py-4 text-right">{`${item.quantity}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* <div className="lg:col-span-1">
          <div className="sticky top-28 p-6 rounded-xl bg-white  shadow-sm flex flex-col gap-6">
            <h3 className="text-lg font-bold text-[#212529] ">Order Total</h3>
            <div className="flex flex-col gap-3 border-b border-gray-200  pb-4">
              <div className="flex justify-between text-sm">
                <p className="text-gray-500 ">Subtotal</p>
                <p className="font-medium text-[#212529] ">$45.00</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-500 ">Taxes &amp; Fees</p>
                <p className="font-medium text-[#212529] ">$4.50</p>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <p className="text-[#212529] ">Total</p>
              <p className="text-primary ">$49.50</p>
            </div>
            <div className="flex flex-col gap-3">
              <button className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Place Order</span>
              </button>
              <button className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-gray-100  text-[#212529]  text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 ">
                <span className="truncate">Back</span>
              </button>
            </div>
            <p className="text-xs text-gray-500  text-center">
              By placing your order, you agree to the Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Page;
