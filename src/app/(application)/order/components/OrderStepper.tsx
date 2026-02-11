"use client";

import { Stepper, Group, Button, Box, Progress } from "@mantine/core";
import {
  IconPackage,
  IconMapPin,
  IconFileCheck,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import useOrderStore from "@/lib/store/OrderStore";
import { useMemo } from "react";

interface OrderStepperProps {
  orderType: "bulk" | "pallet";
  currentStep: number;
  onStepChange?: (step: number) => void;
}

export function OrderStepper({
  orderType,
  currentStep,
  onStepChange,
}: OrderStepperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { bulkOrder, palletOrder, address } = useOrderStore();

  // Get items based on order type
  const items = orderType === "bulk" ? bulkOrder : palletOrder;

  // Validation for each step
  const stepValidation = useMemo(
    () => ({
      items: items.length > 0,
      address:
        !!address.fromAddress?.address &&
        !!address.toAddress?.address &&
        !!address.date &&
        !!address.time,
      summary: items.length > 0 && !!address.fromAddress?.address,
    }),
    [items, address]
  );

  // Step configuration
  const steps = [
    {
      label: "Productos",
      description: "Agregar items",
      icon: IconPackage,
      path: `/order/${orderType}`,
      isValid: stepValidation.items,
      isComplete: stepValidation.items && currentStep > 0,
    },
    {
      label: "Direcciones",
      description: "Origen y destino",
      icon: IconMapPin,
      path: `/order/${orderType}/address`,
      isValid: stepValidation.address,
      isComplete: stepValidation.address && currentStep > 1,
    },
    {
      label: "Resumen",
      description: "Confirmar pedido",
      icon: IconFileCheck,
      path: `/order/${orderType}/summary`,
      isValid: stepValidation.summary,
      isComplete: false,
    },
  ];

  const handleStepClick = (stepIndex: number) => {
    // Don't allow skipping steps without completing previous ones
    if (stepIndex > currentStep) {
      const previousStep = steps[stepIndex - 1];
      if (!previousStep?.isValid) {
        return;
      }
    }

    if (onStepChange) {
      onStepChange(stepIndex);
    }
    router.push(steps[stepIndex].path);
  };

  const canProceed = steps[currentStep]?.isValid;
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <Box mb="xl">
      {/* Progress bar */}
      <Progress
        value={progressPercentage}
        size="sm"
        radius="xl"
        mb="md"
        color={canProceed ? "blue" : "orange"}
      />

      <Stepper
        active={currentStep}
        onStepClick={handleStepClick}
        allowNextStepsSelect={false}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = step.isComplete;
          const isValid = step.isValid;

          return (
            <Stepper.Step
              key={index}
              label={step.label}
              description={step.description}
              icon={
                isCompleted ? (
                  <IconCheck size={18} />
                ) : !isValid && index === currentStep ? (
                  <IconAlertCircle size={18} />
                ) : (
                  <Icon size={18} />
                )
              }
              color={
                isCompleted
                  ? "green"
                  : !isValid && isActive
                    ? "orange"
                    : "blue"
              }
              loading={isActive && !isValid}
            />
          );
        })}
      </Stepper>

      {/* Validation messages */}
      {!canProceed && (
        <Box mt="md" p="sm" style={{ backgroundColor: "#fff3cd", borderRadius: 8 }}>
          <Group gap="xs">
            <IconAlertCircle size={16} color="#856404" />
            <span style={{ color: "#856404", fontSize: 14 }}>
              {currentStep === 0 &&
                !stepValidation.items &&
                "Agrega al menos un item para continuar"}
              {currentStep === 1 &&
                !stepValidation.address &&
                "Completa todos los campos de dirección y fecha"}
            </span>
          </Group>
        </Box>
      )}
    </Box>
  );
}
