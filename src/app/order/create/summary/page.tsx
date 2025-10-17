"use client";
import React, { useEffect, useState } from "react";

import { Tabs } from "@mantine/core";

import { BulkForm } from "../../components/bulkForm";
import useOrderStore from "@/lib/store/OrderStore";
import { Card, TextInput, Text, Badge, Button, Group } from "@mantine/core";
import { FaBox } from "react-icons/fa";
import { PalletForm } from "../../components/palletForm";

const Page = () => {
  const { bulkOrder, address } = useOrderStore();

  useEffect(() => {
    console.log("bulkOrder", bulkOrder);
    console.log("address", address);
  }, [address, bulkOrder]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <Card shadow="sm" padding="lg" radius="md" withBorder className="w-1/2">
        <Card.Section withBorder inheritPadding py="xs">
          <Text>Carga</Text>
        </Card.Section>
        <Group mt="md" mb="xs">
          {bulkOrder.map((bulk, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding>
                <Group mt="md" mb="xs" className="mt-2">
                  <FaBox />
                  <Text>Item</Text>
                </Group>
              </Card.Section>
              {/* <Group mt="md" mb="xs" className="mt-2"> */}
              <div className="mt-4 ">
                <Text size="md">Volumen: {bulk.volume}</Text>
                <Text size="md">Peso: {bulk.weight} kg</Text>
                <Text size="md">Cantidad: {bulk.quantity}</Text>
              </div>
              {/* </Group> */}
            </Card>
          ))}
        </Group>
      </Card>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="mt-4 w-1/2"
      >
        <Card.Section withBorder inheritPadding py="xs">
          <Text>Direccion</Text>
        </Card.Section>
        <div>
          <Text size="md">Desde: {address.fromAddress}</Text>
          <Text size="md">Hasta: {address.toAddress}</Text>
          <Text size="md">Fecha: {address.date}</Text>
          <Text size="md">Hora: {address.time}</Text>
        </div>
      </Card>
    </div>
  );
};

export default Page;
