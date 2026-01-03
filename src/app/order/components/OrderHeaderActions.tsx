"use client";

import React, { useState } from "react";
import { NumberInput, Button, Group, Modal } from "@mantine/core";
import { updateOrderStatus } from "@/lib/api/order/orderApi";
import { useRouter } from "next/navigation";

interface OrderHeaderActionsProps {
  orderId: string;
  initialAmount: number | null;
  orderStatus: string;
}

export default function OrderHeaderActions({
  orderId,
  initialAmount,
  orderStatus,
}: OrderHeaderActionsProps) {
  const [amount, setAmount] = useState<number | string | undefined>(
    initialAmount || undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  const handleConfirmOrder = async () => {
    try {
      setIsLoading(true);
      await updateOrderStatus(orderId, "CONFIRMED");
      setShowConfirmModal(false);
      router.refresh();
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Error al confirmar la orden");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 mt-1">Order {orderId}</p>
        </div>
        {orderStatus === "EN REVISIÓN" && (
          <Button
            onClick={() => setShowConfirmModal(true)}
            loading={isLoading}
            size="md"
            variant="filled"
          >
            Confirm Order
          </Button>
        )}
      </Group>

      {!initialAmount && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Amount
          </label>
          <NumberInput
            placeholder="Enter amount"
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
        opened={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Order"
        centered
      >
        <div className="space-y-4">
          <p>Are you sure you want to confirm this order?</p>
          {!initialAmount && amount && (
            <p className="text-sm text-gray-600">
              Order amount: <strong>${amount}</strong>
            </p>
          )}
          <Group justify="flex-end" mt="lg">
            <Button
              variant="default"
              onClick={() => setShowConfirmModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmOrder} loading={isLoading}>
              Confirm
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
}
