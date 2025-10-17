"use client";
import React from "react";
import { Button } from "@/components/ui/button";
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
// import { Bulk } from "../../../lib/types/bulkType";
import useOrderStore from "@/lib/store/OrderStore";

export const BulkForm = () => {
  // const [bulks, setBulks] = React.useState<Bulk[]>([]);
  const [volume, setVolume] = React.useState(20);
  const [quantity, setQuantity] = React.useState(20);
  const { addBulk } = useOrderStore();
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Solicitud transporte de bultos</CardTitle>
          <CardDescription>
            Ingrese los bultos que desea transportar
          </CardDescription>
        </CardHeader>
        <Separator className="my-4" />

        <CardContent>
          <form>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="volume">Volumen (m3)</Label>
                <Input
                  id="volume"
                  type="volume"
                  placeholder="20"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="quantity"
                  placeholder="20"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full"
            onClick={() => {
              addBulk({
                volume: volume,
                quantity: quantity,
                weight: 0, // set a default or calculated value for weight
              });
            }}
          >
            Agregar
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
