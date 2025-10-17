"use client";
import React, { useState } from "react";

import useOrderStore from "@/lib/store/OrderStore";
import { Breadcrumbs, Anchor, Title, Button } from "@mantine/core";
import { BsPlusCircle } from "react-icons/bs";
import { PalletForm } from "./components/palletForm";
import { createOrder } from "@/lib/api/order/orderApi";

const Page = () => {
  const [active, setActive] = useState(1);
  const { bulkOrder, address } = useOrderStore();
  const callOrderApi = async () => {
    try {
      const response = await createOrder({ ...bulkOrder, ...address }, "bulk");
      console.log("Order created successfully:", response);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };
  const icon = <BsPlusCircle />;
  const nextStep = () =>
    setActive((current) => {
      if (current === 2) {
        // Aquí puedes manejar el envío final de los datos
        callOrderApi();
        return current;
      }
      return current < 2 ? current + 1 : current;
    });
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <div className="flex flex-col justify-start w-100 grow">
      <Breadcrumbs className="mb-4">order</Breadcrumbs>
      <div className="flex justify-between">
        <Title order={2}>Tus Ordenes</Title>
        <Button leftSection={icon}>Crear nueva orden</Button>
      </div>
    </div>
  );
};

export default Page;
