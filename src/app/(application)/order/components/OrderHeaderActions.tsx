"use client";

import React, { useState } from "react";
import { NumberInput, Button, Group, Modal, TextInput } from "@mantine/core";
import { continueOrder } from "@/lib/api/order/orderApi";
import { useRouter } from "next/navigation";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { OrderStatus } from "@/lib/utils/enums";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderHeaderActionsProps {
  orderId: string;
  initialAmount: number | null;
  orderStatus: OrderStatus;
  orderGpsLink?: string;
}

type ActionType = null | "confirm" | "cancel";

export default function OrderHeaderActions({
  orderId,
  initialAmount,
  orderStatus,
  orderGpsLink,
}: OrderHeaderActionsProps) {
  const isAdmin = useCanAccess(["ADMIN"]);
  const router = useRouter();

  const [amount, setAmount] = useState<number | string | undefined>(
    initialAmount ?? undefined,
  );
  const [gpsLink, setGpsLink] = useState<number | string | undefined>(
    orderGpsLink,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<ActionType>(null);
  const [showModal, setShowModal] = useState(false);

  const canModifyOrder = [
    OrderStatus.PRE_APPROVED,
    OrderStatus.REVIEW,
    OrderStatus.IN_PROGRESS,
  ].includes(orderStatus);

  const canConfirmProposal =
    isAdmin && orderStatus === OrderStatus.REVIEW;
  const canConfirmOrder = !isAdmin && orderStatus === OrderStatus.PRE_APPROVED;
  const showAmountInput = canConfirmProposal;
  const showGpsLinkInput =
    !orderGpsLink && isAdmin && orderStatus === OrderStatus.IN_PROGRESS;
  console.log(
    showAmountInput,
    gpsLink,
    isAdmin,
    orderStatus,
    OrderStatus.IN_PROGRESS,
  );
  const handleOpenModal = (actionType: ActionType) => {
    if (actionType === "cancel") {
      setAmount(undefined);
      setGpsLink(undefined);
    }
    setAction(actionType);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      setIsLoading(true);
      await continueOrder({
        orderId,
        amount,
        gpsLink,
        deny: action === "cancel",
      });
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
    if (orderStatus === OrderStatus.IN_PROGRESS) {
      return "Agregar link GPS";
    }
    if (isAdmin && orderStatus === OrderStatus.REVIEW) {
      return initialAmount ? "Modificar monto" : "Enviar propuesta";
    }
    return "Confirmar Orden";
  };

  const getModalContent = () => {
    if (action === "cancel") {
      return "¿Estás seguro de que deseas cancelar esta orden?";
    }
    if (initialAmount && canConfirmProposal) {
      return "¿Desea modificar el monto?";
    }
    return "¿Estás seguro de que deseas confirmar?";
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Order {orderId}</p>
          <div className="mt-3">
            <OrderStatusBadge status={orderStatus} variant="badge" />
          </div>
        </div>

        {canModifyOrder && (
          <Group wrap="wrap">
            {((isAdmin && orderStatus === OrderStatus.REVIEW) ||
              orderStatus === OrderStatus.PRE_APPROVED) && (
              <Button
                onClick={() => handleOpenModal("cancel")}
                loading={isLoading}
                size="md"
                variant="filled"
                color="red"
              >
                Cancelar Orden
              </Button>
            )}

            {isAdmin &&
              !orderGpsLink &&
              orderStatus === OrderStatus.IN_PROGRESS && (
                <Button
                  onClick={() => handleOpenModal("confirm")}
                  loading={isLoading}
                  size="md"
                  variant="filled"
                >
                  {getConfirmButtonLabel()}
                </Button>
              )}
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
      </div>

      {showAmountInput && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {initialAmount ? "Modificar monto" : "Monto Total"}
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

      {showGpsLinkInput && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link GPS
          </label>
          <TextInput
            placeholder="Ingresa el link GPS"
            value={gpsLink}
            onChange={(e) => setGpsLink(e.target.value)}
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
        title={action === "cancel" ? "Cancelar Orden" : "Confirmar"}
        centered
      >
        <div className="space-y-4">
          <p>{getModalContent()}</p>
          {showAmountInput && amount && (
            <p className="text-sm text-gray-600">
              {initialAmount ? "Nuevo" : "Monto de la orden"}:{" "}
              <strong>{amount}</strong>
            </p>
          )}
          {showGpsLinkInput && gpsLink && (
            <p className="text-sm text-gray-600">
              Link GPS: <strong>{gpsLink}</strong>
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
              color={action === "cancel" ? "red" : "green"}
            >
              {action === "cancel" ? "Cancelar Orden" : "Confirmar"}
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
}
