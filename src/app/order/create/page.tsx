"use client";
import React, { useState } from "react";

import { Tabs } from "@mantine/core";

import { BulkForm } from "../components/bulkForm";
import useOrderStore from "@/lib/store/OrderStore";
import { Card, CardContent } from "@/components/ui/card";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { Radio, Group } from "@mantine/core";
import { Text } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Stepper } from "@mantine/core";

import { PalletForm } from "../components/palletForm";

const Page = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { bulkOrder } = useOrderStore();
  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <div className="">
        
        <BulkForm />
        
      </div>
      <div className="flex flex-col items-center mt-4 min-h-32">
        <h2 className="text-lg font-bold mb-2">Lista de Bultos</h2>
        <div className="flex flex-row gap-2 flex-wrap overflow-y-auto ">
          {bulkOrder.map((bulk, index) => (
            <Card key={index}>
              <CardContent>
                Volumen: {bulk.volume},
                <br />
                Cantidad: {bulk.quantity}, Peso: {bulk.weight}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
