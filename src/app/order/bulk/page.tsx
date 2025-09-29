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
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const { bulkOrder } = useOrderStore();
  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <div>
        <Stepper
          active={active}
          onStepClick={setActive}
          className="flex flex-col justify-around  h-full content-center"
        >
          <Stepper.Step label="First step" description="Create an account">
            <div>
              <BulkForm />
            </div>
            <div className="flex flex-col items-center mt-4">
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
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Verify email">
            Step 2 content: Verify email
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Get full access">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group>
      </div>
    </div>
  );
};

export default Page;
