"use client";
import React, { useEffect, useState } from "react";
import { Select, Breadcrumbs } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { AddressForm } from "../components/addressSection";
import { AddressFormProps } from "@/lib/types/palletType";
import { getAvailableSlots } from "@/lib/api/order/orderApi";
import useOrderStore from "@/lib/store/OrderStore";
import { Warehouse } from "@/lib/types/warehouseType";
import { useQuery } from "@tanstack/react-query";
import { getWarehouses } from "@/lib/api/warehouse/warehouseApi";

interface SharedAddressPageProps {
  title?: string;
  breadcrumbs?: string[];
}

/**
 * Shared Address Page Component (with React Query)
 * Used by both bulk and pallet order flows
 */
export const SharedAddressPage: React.FC<SharedAddressPageProps> = ({
  title = "Direccion",
  breadcrumbs = ["order", "create"],
}) => {
  const { addAddress, address } = useOrderStore();
  
  // State management
  const [date, setDate] = useState<string | null>(address?.date || null);
  const [time, setTime] = useState<string | null>(address?.time || null);
  const [hours, setHours] = useState<string[] | null>(null);
  
  const [fromAddress, setFromAddress] = useState<AddressFormProps>({
    address: address?.fromAddress?.address || "",
    district: address?.fromAddress?.district || "",
    city: address?.fromAddress?.city || "",
    state: address?.fromAddress?.state || "",
    locationLink: address?.fromAddress?.locationLink || "",
  });

  const [toAddress, setToAddress] = useState<AddressFormProps>({
    address: address?.toAddress?.address || "",
    district: address?.toAddress?.district || "",
    city: address?.toAddress?.city || "",
    state: address?.toAddress?.state || "",
    locationLink: address?.toAddress?.locationLink || "",
  });

  // Fetch warehouses with React Query
  const { data: warehousesData } = useQuery({
    queryKey: ["warehouses"],
    queryFn: getWarehouses,
  });
  const warehouses = warehousesData?.data || [];

  // Update store when addresses change
  useEffect(() => {
    addAddress({
      fromAddress: { ...fromAddress },
      toAddress: { ...toAddress },
      date,
      time,
    });
  }, [fromAddress, toAddress, date, time]);

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (date) {
        try {
          const slots = await getAvailableSlots(date);
          setHours(slots);
        } catch (error) {
          console.error("Error fetching slots:", error);
        }
      }
    };
    
    fetchSlots();
  }, [date]);

  const handleWarehouseSelect = (warehouseId: string | null) => {
    if (!warehouseId) return;
    
    const selectedWarehouse = warehouses.find(
      (wh) => String(wh.warehouseId) === warehouseId
    );
    
    if (selectedWarehouse) {
      setFromAddress({
        address: selectedWarehouse.address || "",
        district: selectedWarehouse.district || "",
        city: selectedWarehouse.city || "",
        state: selectedWarehouse.state || "",
        warehouseId: selectedWarehouse.warehouseId,
        locationLink: selectedWarehouse.locationLink || "",
      });
    }
  };

  const warehouseOptions = warehouses.map((wh) => ({
    value: String(wh.warehouseId),
    label: wh.name,
  }));

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-8 p-4">
              <Breadcrumbs className="mb-4">{breadcrumbs}</Breadcrumbs>
              
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex min-w-72 flex-col">
                  <p className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em]">
                    {title}
                  </p>
                </div>
              </div>

              {/* Warehouse Selection */}
              <Select
                label="Escoja un almacén"
                placeholder="Seleccione un almacén"
                data={warehouseOptions}
                searchable
                classNames={{
                  label: "select-label",
                  input: "select-input",
                }}
                onChange={handleWarehouseSelect}
              />

              {/* From Address */}
              <AddressForm
                title="Desde"
                address={fromAddress}
                setAddress={setFromAddress}
                edit={false}
              />

              {/* To Address */}
              <AddressForm
                title="Hacia"
                address={toAddress}
                setAddress={setToAddress}
              />

              {/* Pickup Date & Time */}
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
                        onChange={setTime}
                        disabled={!date || !hours}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedAddressPage;
