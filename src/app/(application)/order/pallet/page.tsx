"use client";
import React, { useState } from "react";
import { Checkbox, Select } from "@mantine/core";
import useOrderStore from "@/lib/store/OrderStore";
import { Pallet } from "@/lib/types/palletType";
import { usePallets } from "@/lib/hooks/usePallets";
import { PackageItem } from "../components/packageItem";
import { OrderFormBase } from "../components/OrderFormBase";
import { FormFieldInput } from "../components/FormFieldInput";
import "./order.css";

// Initial form state
const getInitialForm = () => ({
  id: "",
  width: 0,
  height: 0,
  length: 0,
  weight: 0,
  quantity: 0,
});

const Page = () => {
  const { pallets } = usePallets();
  const { addPallet, palletOrder, deleteItem } = useOrderStore();
  
  const [selectedPallet, setSelectedPallet] = useState("");
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState(getInitialForm());

  // Generate select options
  const selectOptions = [
    ...pallets.map((pallet) => ({
      value: pallet.id,
      label: `${pallet.length}m x ${pallet.width}m x ${pallet.height}m`,
    })),
    { value: "custom", label: "Personalizado" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePalletSelect = (value: string | null) => {
    if (!value) return;
    
    setSelectedPallet(value);
    
    if (value === "custom") {
      setForm(getInitialForm());
      return;
    }

    const pallet = pallets.find((p) => p.id === value);
    if (pallet) {
      setForm({
        ...form,
        width: pallet.width,
        height: pallet.height,
        length: pallet.length,
        id: pallet.id,
      });
    }
  };

  const handleAddPallet = () => {
    addPallet({
      ...form,
      enabled: true,
      tempId: crypto.randomUUID(),
    } as Pallet);
  };

  const formContent = (
    <div className="flex flex-col gap-6 border-b border-border-light dark:border-border-dark pb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          label="Escoja un pallet (largo x ancho x alto)"
          placeholder="Escoja un pallet"
          data={selectOptions}
          searchable
          classNames={{
            label: "select-label",
            input: "select-input",
          }}
          onChange={handlePalletSelect}
        />
        <FormFieldInput
          label="Largo"
          name="length"
          placeholder="e.g., 20"
          value={form.length}
          onChange={handleChange}
          unit="m"
          disabled={selectedPallet !== "custom"}
        />
        <FormFieldInput
          label="Ancho"
          name="width"
          placeholder="e.g., 20"
          value={form.width}
          onChange={handleChange}
          unit="m"
          disabled={selectedPallet !== "custom"}
        />
        <FormFieldInput
          label="Altura"
          name="height"
          placeholder="e.g., 20"
          value={form.height}
          onChange={handleChange}
          unit="cm"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <FormFieldInput
          label="Peso"
          name="weight"
          placeholder="e.g., 5"
          value={form.weight}
          onChange={handleChange}
          unit="kg"
        />
        <FormFieldInput
          label="Cantidad"
          name="quantity"
          placeholder="e.g., 1"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end pt-2">
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-base font-medium leading-normal pb-2">
            Se puede apilar
          </p>
          <Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
        </label>
        <button
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-200 px-5 py-3 text-base font-semibold text-text-light dark:text-text-dark hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark"
          onClick={handleAddPallet}
        >
          Añadir
        </button>
      </div>
    </div>
  );

  const itemsList = (
    <>
      {palletOrder.map((pallet: Pallet, index: number) => (
        <PackageItem
          key={pallet.tempId}
          id={String(index + 1)}
          length={pallet.length}
          weight={pallet.weight}
          height={pallet.height}
          width={pallet.width}
          is3D={true}
          name="Package"
          quantity={pallet.quantity}
          onDelete={() => deleteItem(pallet.tempId)}
        />
      ))}
    </>
  );

  return (
    <OrderFormBase
      title="Añadir Pallets"
      description="Añade los detalles de los pallets que deseas enviar."
      formContent={formContent}
      itemsList={itemsList}
      listTitle="Pallets"
    />
  );
};

export default Page;
