"use client";
import React, { useEffect, useState } from "react";

import { redirect, usePathname } from "next/navigation";

import { Button, Group, Stepper } from "@mantine/core";
import useOrderStore from "@/lib/store/OrderStore";
import { createOrder } from "@/lib/api/order/orderApi";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const steps = ["bulk", "address", "summary"];
  const [active, setActive] = useState(0);
  const { bulkOrder, address } = useOrderStore();
  const callOrderApi = async () => {
    try {
      const response = await createOrder(
        {
          pallets: bulkOrder,
          ...address,
          zoneId: 1,
          deliveryDate: `${address.date} ${address.time}`,
        },
        "BULK"
      );
      console.log("Order created successfully:", response);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };
  const pathname = usePathname();
  const nextStep = () =>
    setActive((current) => {
      if (current === 2) {
        // Aquí puedes manejar el envío final de los datos
        console.log("bulkOrder", bulkOrder);
        console.log("address", address);
        callOrderApi();
        return current;
      }
      return redirect(`/order/${steps[active + 1]}`);
    });
  const prevStep = () => redirect(`/order/${steps[active - 1]}`);
  useEffect(() => {
    const pathSegment = pathname.split("/").pop();
    const stepIndex = steps.indexOf(pathSegment || "bulk");
    setActive(stepIndex !== -1 ? stepIndex : 0);
  }, [pathname]);

  const redirectOnChange = (step: number) => {
    console.log("step", step);
    redirect(`/order/${steps[step]}`);
  };

  return (
    <div className="relative flex grow  flex-col group/design-root overflow-x-hidden">
      {/* Layout UI */}
      {/* Place children where you want to render a page or nested layout */}
      <main className="flex flex-col justify-center items-center p-4 w-full">
        <Stepper
          className="flex"
          active={active}
          onStepClick={redirectOnChange}
        >
          <Stepper.Step
            label="First step"
            description="Create an account"
          ></Stepper.Step>
          <Stepper.Step
            label="Second step"
            description="Verify email"
          ></Stepper.Step>
          <Stepper.Step
            label="Final step"
            description="Get full access"
          ></Stepper.Step>
        </Stepper>

        {children}

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Anterior
          </Button>
          <Button onClick={nextStep}>
            {active == 2 ? "Enviar" : "Siguiente"}
          </Button>
        </Group>
      </main>
    </div>
  );
}
