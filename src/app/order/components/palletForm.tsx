import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// import { Bulk } from "../../../lib/types/bulkType";
import useOrderStore from "@/lib/store/OrderStore";

export const PalletForm = () => {
  const [form, setForm] = useState({
    width: "",
    height: "",
    length: "",
    quantity: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [pickup, setPickup] = useState({
    address: "",
    time: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickup({ ...pickup, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(false);
    // Aquí puedes manejar el envío final de los datos
  };

  return (
    <>
      <Card className="max-w-[400px] mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Datos del Pallet
          </CardTitle>
        </CardHeader>
        <Separator className="my-4" />
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Label htmlFor="width">Ancho (m3)</Label>
            <Input
              name="width"
              type="number"
              value={form.width}
              onChange={handleChange}
              required
            />
            <Label htmlFor="height">Alto (m3)</Label>
            <Input
              name="height"
              type="number"
              value={form.height}
              onChange={handleChange}
              required
            />
            <Label htmlFor="length">Largo (m3)</Label>
            <Input
              name="length"
              type="number"
              value={form.length}
              onChange={handleChange}
              required
            />
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" color="primary" className="w-full">
              Siguiente
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleModalSubmit}>
          <ModalHeader>Dirección y Hora de Entrega</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <Input
              label="Dirección de recogida"
              name="address"
              value={pickup.address}
              onChange={handlePickupChange}
              required
            />
            <Input
              label="Hora de entrega"
              name="time"
              type="datetime-local"
              value={pickup.time}
              onChange={handlePickupChange}
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">
              Confirmar
            </Button>
            <Button
              type="button"
              variant="light"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal> */}
    </>
  );
};
