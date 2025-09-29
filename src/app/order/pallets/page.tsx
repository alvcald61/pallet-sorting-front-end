"use client";
import React from "react";

import { Tabs } from "@mantine/core";

import { BulkForm } from "./components/bulkForm";
import useOrderStore from "@/lib/store/OrderStore";
import { Card, CardContent } from "@/components/ui/card";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { Radio, Group } from "@mantine/core";
import { Text } from "@mantine/core";
import { TextInput } from "@mantine/core";

import { PalletForm } from "./components/palletForm";

const Page = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { bulkOrder } = useOrderStore();
  return (
    <div className="tab-list">
      <Tabs defaultValue="bulk">
        <Tabs.List>
          <Tabs.Tab value="bulk">Bultos</Tabs.Tab>
          <Tabs.Tab value="pallet">Pallets</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="bulk">
          <div className="flex flex-none flex-col items-center justify-center p-4">
            <BulkForm />
            <div className="flex flex-none flex-col items-center mt-4">
              <h2 className="text-lg font-bold">Lista de Bultos</h2>
              <div className="flex flex-row gap-2 flex-wrap">
                {bulkOrder.map((bulk, index) => (
                  <Card key={index}>
                    <CardContent>
                      Volumen: {bulk.volume}, Cantidad: {bulk.quantity}, Peso:{" "}
                      {bulk.weight}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="pallet">
          {" "}
          <PalletForm />
        </Tabs.Panel>
      </Tabs>

      <div>
        <Modal
          opened={opened}
          onClose={close}
          title="Completar información"
          centered
        >
          <div className="grid col-span-3 gap-4">
            <div className="grid flex-1 gap-2">
              <Radio.Group name="pickup" label="¿Desde terminal?" withAsterisk>
                <Group mt="xs">
                  <Radio value="pickup" label="Recojo de almacén" />
                  <Radio value="send" label="Recojo de puerto" />
                </Group>
              </Radio.Group>
            </div>
            <div className="grid flex-1 gap-2">
              <TextInput
                label="Dirección de envio"
                placeholder="Calle Falsa 123"
              />
            </div>
            <div className="grid flex-1 gap-2">
              <TextInput label="Horario" placeholder="Calle Falsa 123" />
            </div>
          </div>
        </Modal>

        <Button variant="default" onClick={open}>
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default Page;
