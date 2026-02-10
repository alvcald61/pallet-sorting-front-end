"use client";
import React, { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { Notification } from "@mantine/core";
import { Button, Group, Stepper } from "@mantine/core";
import useOrderStore from "@/lib/store/OrderStore";
import { createOrder } from "@/lib/api/order/orderApi";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
interface OrderLayoutWrapperProps {
  children: React.ReactNode;
  orderType: "BULK" | "TWO_DIMENSIONAL";
  basePath: "bulk" | "pallet";
  stepsConfig?: {
    label: string;
    description: string;
  }[];
}

export default function OrderLayoutWrapper({
  children,
  orderType,
  basePath,
  stepsConfig,
}: OrderLayoutWrapperProps) {
  const steps = ["", "address", "summary"];
  const [active, setActive] = useState(0);
  const { bulkOrder, palletOrder, address, userId } = useOrderStore();
  const [notificationVisible, setNotificationVisible] = useState(false);

  const orderData = orderType === "BULK" ? bulkOrder : palletOrder;
  const router = useRouter();

  const callOrderApi = async () => {
    try {
      const response = await createOrder({
        orderData: {
          pallets: orderData,
          ...address,
          zoneId: 1,
          deliveryDate: `${address.date} ${address.time}`,
          userId: userId || "",
        },
        type: orderType,
      });
      setNotificationVisible(true);
      setTimeout(() => {
        setNotificationVisible(false);
      }, 3000);
      router.push(`/order`);
      console.log("Order created successfully:", response);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const pathname = usePathname();

  const nextStep = () =>
    setActive((current) => {
      if (current === 2) {
        console.log("orderData", orderData);
        console.log("address", address);
        callOrderApi();
        setNotificationVisible(true);
        setTimeout(() => {
          setNotificationVisible(false);
          redirect(`/order`);
        }, 3000);
        return current;
      }
      return redirect(`/order/${basePath}/${steps[current + 1]}`);
    });

  const prevStep = () => redirect(`/order/${basePath}/${steps[active - 1]}`);

  useEffect(() => {
    const pathSegment = pathname.split("/").pop();
    const stepIndex = steps.indexOf(pathSegment || "create");
    setActive(stepIndex !== -1 ? stepIndex : 0);
  }, [pathname]);

  const redirectOnChange = (step: number) => {
    console.log("step", step);
    redirect(`/order/${basePath}/${steps[step]}`);
  };

  const defaultSteps = [
    { label: "First step", description: "Create" },
    { label: "Second step", description: "Address" },
    { label: "Final step", description: "Summary" },
  ];

  const displaySteps = stepsConfig || defaultSteps;

  return (
    <div className="relative flex grow  flex-col group/design-root overflow-x-hidden mt-20">
      <main className="flex flex-col justify-center items-center p-4 w-full">
        <Stepper
          className="flex"
          active={active}
          onStepClick={redirectOnChange}
        >
          {displaySteps.map((step, index) => (
            <Stepper.Step
              key={index}
              label={step.label}
              description={step.description}
            />
          ))}
        </Stepper>

        {children}

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Anterior
          </Button>
          <Button onClick={active == 2 ? callOrderApi : nextStep}>
            {active == 2 ? "Enviar" : "Siguiente"}
          </Button>
        </Group>
      </main>
      {notificationVisible && (
        <Notification
          icon={<FaCheckCircle />}
          color="green"
          title="Orden creada"
        >
          La orden ha sido creada exitosamente.
        </Notification>
      )}
    </div>
  );
}
