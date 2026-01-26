"use client";
import React, { useEffect, useState } from "react";

import { Select, Tabs } from "@mantine/core";

import { AddressForm } from "../../components/addressSection";

import { AddressFormProps } from "@/lib/types/palletType";
import { getAvailableSlots } from "@/lib/api/order/orderApi";
import { DatePickerInput } from "@mantine/dates";
// @ts-ignore: allow importing CSS without a module declaration
import "./style.css";
import useOrderStore from "@/lib/store/OrderStore";
import { getWarehouses } from "@/lib/api/warehouse/warehouseApi";
import { Warehouse } from "@/lib/types/warehouseType";

const Page = () => {
  const { addAddress, address } = useOrderStore();
  const [date, setDate] = useState<string | null>(address?.date || null);
  const [time, setTime] = useState<string | null>(address?.time || null);
  const [hours, setHours] = useState<string[] | null>(null);
  const [warehouse, setWarehouse] = useState<Warehouse[] | null>(null);
  const [fromAddress, setFromAddress] = useState<AddressFormProps>({
    address: address?.fromAddress?.address || "",
    district: address?.fromAddress?.district || "",
    city: address?.fromAddress?.city || "",
    state: address?.fromAddress?.state || "",
  });

  const [toAddress, setToAddress] = useState<AddressFormProps>({
    address: address?.toAddress?.address || "",
    district: address?.toAddress?.district || "",
    city: address?.toAddress?.city || "",
    state: address?.toAddress?.state || "",
  });

  useEffect(() => {
    const address = {
      fromAddress: { ...fromAddress },
      toAddress: { ...toAddress },
      date: date,
      time: time,
    };
    addAddress(address);
  }, [fromAddress, toAddress, date, time]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (date) {
        console.log("Selected date:", date);
        const slots = await getAvailableSlots(date);
        setHours(slots);
      }
    };

    const fetchWarehouses = async () => {
      const warehouses = await getWarehouses();
      console.log("Warehouses:", warehouses);
      setWarehouse(warehouses.data);
    };
    Promise.all([fetchSlots(), fetchWarehouses()]);
  }, [date]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <div className="">
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <div className="flex flex-1 justify-center py-5">
              <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <main className="flex-1 px-4 md:px-10 py-8">
                  <div className="flex flex-wrap justify-between gap-3 p-4">
                    <div className="flex min-w-72 flex-col gap-3">
                      <p className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em]">
                        Direccion
                      </p>
                    </div>
                  </div>
                  <Select
                    label="Escoja un almacén"
                    placeholder="Escoja un almacén"
                    data={
                      warehouse?.map((wh) => ({
                        value: String(wh.warehouseId),
                        label: wh.name,
                      })) || []
                    }
                    searchable
                    classNames={{
                      label: "select-label",
                      input: "select-input",
                    }}
                    onChange={(value) => {
                      const selectedWarehouse = warehouse?.find(
                        (wh) => String(wh.warehouseId) === value
                      );
                      console.log("Selected warehouse:", selectedWarehouse);
                      setFromAddress({
                        address: selectedWarehouse?.address || "",
                        district: selectedWarehouse?.district || "",
                        city: selectedWarehouse?.city || "",
                        state: selectedWarehouse?.state || "",
                        warehouseId: selectedWarehouse?.warehouseId,
                        addressLink: selectedWarehouse?.locationLink || "",
                      } as AddressFormProps);
                    }}
                  />
                  <AddressForm
                    title="Desde"
                    edit={false}
                    address={fromAddress}
                    setAddress={setFromAddress}
                  />
                  <AddressForm
                    title="Hacia"
                    address={toAddress}
                    setAddress={setToAddress}
                  />
                  <div className="mt-8">
                    <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                      Fecha de recojo
                    </h2>
                    <div className="bg-white dark:bg-background-dark/30 p-6 rounded-lg shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <DatePickerInput
                            classNames={{
                              label: "select-label",
                              input: "select-input",
                            }}
                            label="Fecha"
                            placeholder="Elija una fecha"
                            value={date}
                            onChange={setDate}
                            minDate={new Date().toDateString()}
                          />
                        </div>
                        <div>
                          <div>
                            <Select
                              classNames={{
                                label: "select-label",
                                input: "select-input",
                              }}
                              label="Hora"
                              placeholder="Elija una hora"
                              data={hours || []}
                              searchable
                              value={time}
                              onChange={(value) => {
                                setTime(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
