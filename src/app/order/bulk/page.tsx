"use client";
import React, { useEffect, useState } from "react";

import useOrderStore from "@/lib/store/OrderStore";

import { Pallet } from "@/lib/types/palletType";
import { getAllPallets } from "@/lib/api/order/palletApi";
// @ts-ignore: allow importing CSS without a module declaration
import "./order.css";
import { Bulk } from "@/lib/types/bulkType";
import { BulkItem } from "../components/BulkItem";
import { Breadcrumbs } from "@mantine/core";
import { object, string, number, date, InferType } from "yup";
import { Formik, Form, Field } from "formik";
import { require, positive, integer } from "@/lib/const";

let bulkSchema = object({
  volume: number().required(require).positive(positive),
  weight: number().required(require).positive(positive),
  quantity: number().required(require).positive(positive).integer(integer),
});

const Page = () => {
  const [select, setSelect] = useState([]);
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const { addBulk, bulkOrder, deleteItem } = useOrderStore();

  const [form, setForm] = useState({
    id: "",
    volume: 0,
    weight: 0,
    quantity: 0,
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

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-8 p-4">
              <Breadcrumbs className="mb-4">{["order", "create"]}</Breadcrumbs>
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex min-w-72 flex-col gap-2">
                  <p className="text-4xl font-black leading-tight tracking-[-0.033em]">
                    Añadir Bultos
                  </p>
                  <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
                    Añade los detalles de los bultos que deseas enviar.
                  </p>
                </div>
              </div>
              <Formik
                initialValues={{
                  volume: 0,
                  weight: 0,
                  quantity: 0,
                }}
                validationSchema={bulkSchema}
                onSubmit={(values) => {
                  addBulk({ ...values, tempId: crypto.randomUUID() } as Bulk);
                  console.log(values);
                }}
              >
                {({ errors, touched }) => (
                  <Form className="flex flex-col gap-6 border-b border-border-light dark:border-border-dark pb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-base font-medium leading-normal pb-2">
                          Volumen
                        </p>
                        <div className="relative flex items-center">
                          <Field
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="e.g., 20"
                            // value={form.volume}
                            // onChange={handleChange}
                            name="volume"
                            type="number"
                          />

                          <span className="absolute right-4 text-gray-500 dark:text-gray-400">
                            m3
                          </span>
                        </div>
                        {errors.volume && touched.volume ? (
                          <div>{errors.volume}</div>
                        ) : null}
                      </label>
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-base font-medium leading-normal pb-2">
                          Peso
                        </p>
                        <div className="relative flex items-center">
                          <Field
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="e.g., 5"
                            // value={form.weight}
                            // onChange={handleChange}
                            type="number"
                            name="weight"
                          />
                          <span className="absolute right-4 text-gray-500 dark:text-gray-400">
                            kg
                          </span>
                        </div>
                        {errors.weight && touched.weight ? (
                          <div>{errors.weight}</div>
                        ) : null}
                      </label>
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-base font-medium leading-normal pb-2">
                          Cantidad
                        </p>
                        <div className="relative flex items-center">
                          <Field
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="e.g., 1"
                            // value={form.quantity}
                            // onChange={handleChange}
                            type="number"
                            name="quantity"
                          />
                        </div>
                        {errors.quantity && touched.quantity ? (
                          <div>{errors.quantity}</div>
                        ) : null}
                      </label>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-200 px-5 py-3 text-base font-semibold text-text-light dark:text-text-dark hover:bg-blue-300  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark"
                        type="submit"
                      >
                        Añadir
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="flex flex-col gap-4 pt-8">
                <h3 className="text-xl font-bold leading-7">Pallets</h3>
                <div className="flex flex-col gap-4">
                  {bulkOrder.map((pallet: Bulk, index: number) => (
                    <BulkItem
                      key={index}
                      id={index + 1 + ""}
                      {...pallet}
                      name={"Bulto"}
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
