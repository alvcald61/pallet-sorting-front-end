"use client";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BulkForm } from "./components/bulkForm";
import useOrderStore from "@/lib/store/OrderStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PalletForm } from "./components/palletForm";

const Page = () => {
  const { bulkOrder } = useOrderStore();
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Tabs
        defaultValue="bulk"
        className="flex flex-none items-center justify-center"
      >
        <TabsList>
          <TabsTrigger value="bulk">Bultos</TabsTrigger>
          <TabsTrigger value="pallet">Pallets</TabsTrigger>
        </TabsList>
        <TabsContent value="bulk">
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
        </TabsContent>
        <TabsContent value="pallet">
          <PalletForm />
        </TabsContent>
      </Tabs>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Enviar</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Completar información</DialogTitle>
              {/* <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid col-span-3 gap-4">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="from">¿Desde terminal?</Label>
                <RadioGroup defaultValue="pickup" className="grid grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Recojo de almacén</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="send" id="send" />
                    <Label htmlFor="send">Recojo de puerto</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="address" className="">
                  Dirección de envío
                </Label>
                <Input id="address" defaultValue="Calle Falsa 123" />
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="time">Horario</Label>
                <Input id="time" defaultValue="Calle Falsa 123" />
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  enviar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
