"use client";
import React, { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  Input,
  Select,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";

import useOrderStore from "@/lib/store/OrderStore";
import { Card, CardContent } from "@/components/ui/card";
import { useDisclosure } from "@mantine/hooks";

import { PalletForm } from "../components/palletForm";
import { Pallet } from "@/lib/types/palletType";
import { getAllPallets } from "@/lib/api/order/palletApi";
import { FaRegTrashCan } from "react-icons/fa6";
import { ActionIcon } from "@mantine/core";
import { PackageItem } from "../components/packageItem";
// @ts-ignore: allow importing CSS without a module declaration
import "./order.css";
const Page = () => {
  const [select, setSelect] = useState([]);
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [selectedPallet, setSelectedPallet] = useState("");
  const [checked, setChecked] = useState(false);
  const { addPallet, palletOrder, deleteItem } = useOrderStore();

  const [form, setForm] = useState({
    id: "",
    width: 0,
    height: 0,
    length: 0,
    weight: 0,
    quantity: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [pickup, setPickup] = useState({
    address: "",
    time: "",
  });

  useEffect(() => {
    const fetchPallets = async () => {
      const response = (await getAllPallets()) || [];
      setPallets(response.data);
      setSelect(
        response.data.map((pallet: any) => {
          return {
            value: pallet.id,
            label: `${pallet.width}m x ${pallet.height}m x ${pallet.length}m`,
          };
        })
      );
    };
    fetchPallets();
  }, []);

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
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-8 p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex min-w-72 flex-col gap-2">
                  <p className="text-4xl font-black leading-tight tracking-[-0.033em]">
                    Añadir Pallets
                  </p>
                  <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
                    Añade los detalles de los pallets que deseas enviar.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-6 border-b border-border-light dark:border-border-dark pb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-base font-medium leading-normal pb-2">
                      Se puede apilar
                    </p>
                    <Checkbox
                      checked={checked}
                      onChange={(event) =>
                        setChecked(event.currentTarget.checked)
                      }
                    />
                  </label> */}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-base font-medium leading-normal pb-2">
                      Se puede apilar
                    </p>
                    <Checkbox
                      checked={checked}
                      onChange={(event) =>
                        setChecked(event.currentTarget.checked)
                      }
                    />
                  </label> */}
                  <Select
                    label="Escoja un pallet"
                    placeholder="Escoja un pallet"
                    data={select}
                    searchable
                    classNames={{
                      label: "select-label",
                      input: "select-input",
                    }}
                    onChange={(value) => {
                      const pallet = pallets.find((p: any) => p.id === value);
                      if (pallet) {
                        setForm({
                          ...form,
                          width: pallet.width,
                          height: pallet.height,
                          length: pallet.length,
                          id: pallet.id,
                        });
                      }
                    }}
                  />
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-base font-medium leading-normal pb-2">
                      Largo
                    </p>
                    <div className="relative flex items-center">
                      <input
                        disabled
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                        placeholder="e.g., 20"
                        value={form.length}
                        onChange={handleChange}
                        name="length"
                      />
                      <span className="absolute right-4 text-gray-500 dark:text-gray-400">
                        m
                      </span>
                    </div>
                  </label>
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-base font-medium leading-normal pb-2">
                      Ancho
                    </p>
                    <div className="relative flex items-center">
                      <input
                        disabled
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                        placeholder="e.g., 20"
                        value={form.width}
                        onChange={handleChange}
                        name="width"
                      />
                      <span className="absolute right-4 text-gray-500 dark:text-gray-400">
                        m
                      </span>
                    </div>
                  </label>
                  {checked && (
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-base font-medium leading-normal pb-2">
                        Altura
                      </p>
                      <div className="relative flex items-center">
                        <input
                          disabled
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                          placeholder="e.g., 20"
                          value={form.height}
                          onChange={handleChange}
                          name="height"
                        />
                        <span className="absolute right-4 text-gray-500 dark:text-gray-400">
                          cm
                        </span>
                      </div>
                    </label>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-base font-medium leading-normal pb-2">
                      Peso
                    </p>
                    <div className="relative flex items-center">
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                        placeholder="e.g., 5"
                        value={form.weight}
                        onChange={handleChange}
                        name="weight"
                      />
                      <span className="absolute right-4 text-gray-500 dark:text-gray-400">
                        kg
                      </span>
                    </div>
                  </label>
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-base font-medium leading-normal pb-2">
                      Cantidad
                    </p>
                    <div className="relative flex items-center">
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                        placeholder="e.g., 1"
                        value={form.quantity}
                        onChange={handleChange}
                        name="quantity"
                      />
                    </div>
                  </label>
                </div>
                <div className="flex justify-end pt-2">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-base font-medium leading-normal pb-2">
                      Se puede apilar
                    </p>
                    <Checkbox
                      checked={checked}
                      onChange={(event) =>
                        setChecked(event.currentTarget.checked)
                      }
                    />
                  </label>
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-200 px-5 py-3 text-base font-semibold text-text-light dark:text-text-dark hover:bg-blue-300  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark"
                    onClick={() => {
                      addPallet({ ...form } as Pallet);
                    }}
                  >
                    <span>Añadir</span>
                  </button> 
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-8">
                <h3 className="text-xl font-bold leading-7">Pallets</h3>
                <div className="flex flex-col gap-4">
                  {palletOrder.map((pallet: Pallet, index: number) => (
                    <PackageItem
                      id={index + 1 + ""}
                      length={pallet.length}
                      weight={pallet.weight}
                      height={pallet.height}
                      width={pallet.width}
                      is3D={false}
                      name="Package"
                      quantity={pallet.quantity}
                      onDelete={(id: string) => deleteItem(pallet.tempId)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
