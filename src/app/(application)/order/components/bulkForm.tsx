"use client";
import React from "react";
import { Card, TextInput, Button, Divider, Text, Title } from "@mantine/core";
import useOrderStore from "@/lib/store/OrderStore";

export const BulkForm = () => {
  const [volume, setVolume] = React.useState(20);
  const [quantity, setQuantity] = React.useState(20);
  const [weight, setWeight] = React.useState(20);
  const { addBulk } = useOrderStore();
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4}>Solicitud transporte de bultos</Title>
        <Text size="sm" c="dimmed">
          Ingrese los bultos que desea transportar
        </Text>

        <Divider my="md" />

        <form>
          <div className="flex flex-col gap-4">
            <TextInput
              label="Volumen (m3)"
              id="volume"
              type="number"
              placeholder="2"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              required
            />
            <TextInput
              label="Cantidad"
              id="quantity"
              type="number"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
            <TextInput
              label="Peso (Kg)"
              id="weight"
              type="number"
              placeholder="3"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              required
            />
          </div>
        </form>

        <Button
          fullWidth
          mt="md"
          onClick={() => {
            addBulk({
              tempId: Date.now().toString(),
              volume: volume,
              quantity: quantity,
              weight: weight,
              height: 1.5,
            });
          }}
        >
          Agregar
        </Button>
      </Card>
    </>
  );
};
