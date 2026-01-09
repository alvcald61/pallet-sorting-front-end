"use client";

import React, { useState } from "react";
import { NumberInput, Button, Group, Modal } from "@mantine/core";
import { continueOrder } from "@/lib/api/order/orderApi";
import { useRouter } from "next/navigation";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { OrderStatus } from "@/lib/utils/enums";

interface OrderHeaderActionsProps {
  orderId: string;
  initialAmount: number | null;
  orderStatus: OrderStatus;
  gpsLink?: string;
}

type ActionType = null | "confirm" | "cancel";

export default function OrderHeaderActions({
  orderId,
  initialAmount,
  orderStatus,
  gpsLink,
}: OrderHeaderActionsProps) {
  const isAdmin = useCanAccess(["ADMIN"]);
  const router = useRouter();

  const [amount, setAmount] = useState<number | string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<ActionType>(null);
  const [showModal, setShowModal] = useState(false);

  const canModifyOrder = [
    OrderStatus.PRE_APPROVED,
    OrderStatus.REVIEW,
  ].includes(orderStatus);

  const canConfirmProposal =
    isAdmin && orderStatus === OrderStatus.REVIEW && !initialAmount;
  const canConfirmOrder = !isAdmin && orderStatus === OrderStatus.PRE_APPROVED;
  const showAmountInput = !initialAmount && canConfirmProposal;

  const handleOpenModal = (actionType: ActionType) => {
    if (actionType === "cancel") {
      setAmount(undefined);
    }
    setAction(actionType);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      setIsLoading(true);
      await continueOrder(orderId, amount, action === "cancel");
      setShowModal(false);
      setAction(null);
      router.refresh();
    } catch (error) {
      console.error("Error procesando orden:", error);
      alert("Error al procesar la orden");
    } finally {
      setIsLoading(false);
    }
  };

  const getConfirmButtonLabel = () => {
    if (isAdmin && orderStatus === OrderStatus.REVIEW) {
      return initialAmount ? "Confirmar Orden" : "Enviar propuesta";
    }
    return "Confirmar Orden";
  };

  const getModalContent = () => {
    if (action === "cancel") {
      return "¿Estás seguro de que deseas cancelar esta orden?";
    }
    return "¿Estás seguro de que deseas confirmar esta orden?";
  };

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 mt-1">Order {orderId}</p>
        </div>

        {canModifyOrder && (
          <Group>
            <Button
              onClick={() => handleOpenModal("cancel")}
              loading={isLoading}
              size="md"
              variant="filled"
              color="red"
            >
              Cancelar Orden
            </Button>

            {isAdmin && orderStatus === OrderStatus.REVIEW && (
              <Button
                onClick={() => handleOpenModal("confirm")}
                loading={isLoading}
                size="md"
                variant="filled"
              >
                {getConfirmButtonLabel()}
              </Button>
            )}

            {canConfirmOrder && (
              <Button
                onClick={() => handleOpenModal("confirm")}
                loading={isLoading}
                size="md"
                variant="filled"
              >
                Confirmar Orden
              </Button>
            )}
          </Group>
        )}
      </Group>

      {showAmountInput && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto Total
          </label>
          <NumberInput
            placeholder="Ingresa el monto"
            value={amount}
            onChange={setAmount}
            min={0}
            step={0.01}
            hideControls={false}
            size="sm"
          />
        </div>
      )}

      <Modal
        opened={showModal}
        onClose={() => {
          setShowModal(false);
          setAction(null);
        }}
        title={action === "cancel" ? "Cancelar Orden" : "Confirmar Orden"}
        centered
      >
        <div className="space-y-4">
          <p>{getModalContent()}</p>
          {showAmountInput && amount && (
            <p className="text-sm text-gray-600">
              Monto de la orden: <strong>${amount}</strong>
            </p>
          )}
          <Group justify="flex-end" mt="lg">
            <Button
              variant="default"
              onClick={() => {
                setShowModal(false);
                setAction(null);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAction}
              loading={isLoading}
              color={action === "cancel" ? "red" : undefined}
            >
              {action === "cancel" ? "Cancelar Orden" : "Confirmar"}
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
}
