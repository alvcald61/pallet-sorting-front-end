"use client";
import React, { useEffect, useState } from "react";
import useOrderStore from "@/lib/store/OrderStore";
import { Pallet } from "@/lib/types/palletType";
import { getAllPallets } from "@/lib/api/order/palletApi";
// @ts-ignore: allow importing CSS without a module declaration
import "./order.css";
import { Bulk } from "@/lib/types/bulkType";
import { BulkItem } from "../components/BulkItem";
import { object, number, InferType } from "yup";
import { Formik, Form, Field } from "formik";
import { require, positive, integer } from "@/lib/const";
import { OrderFormBase } from "../components/OrderFormBase";

let bulkSchema = object({
  volume: number().required(require).positive(positive),
  weight: number().required(require).positive(positive),
  quantity: number().required(require).positive(positive).integer(integer),
  height: number().required(require).positive(positive),
});

const Page = () => {
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const { addBulk, bulkOrder, deleteItem } = useOrderStore();

  useEffect(() => {
    const fetchPallets = async () => {
      const response = (await getAllPallets()) || [];
      setPallets(response.data);
    };
    fetchPallets();
  }, []);

  const formContent = (
    <Formik
      initialValues={{
        volume: 0,
        weight: 0,
        quantity: 0,
        height: 0,
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
              <p className="text-base font-medium leading-normal pb-2">Peso</p>
              <div className="relative flex items-center">
                <Field
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="e.g., 5"
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
                  type="number"
                  name="quantity"
                />
              </div>
              {errors.quantity && touched.quantity ? (
                <div>{errors.quantity}</div>
              ) : null}
            </label>
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-base font-medium leading-normal pb-2">
                Altura
              </p>
              <div className="relative flex items-center">
                <Field
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="e.g., 1"
                  type="number"
                  name="height"
                />
              </div>
              {errors.height && touched.height ? (
                <div>{errors.height}</div>
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
  );

  const itemsList = (
    <>
      {bulkOrder.map((pallet: Bulk, index: number) => (
        <BulkItem
          key={index}
          id={index + 1 + ""}
          {...pallet}
          name={"Bulto"}
          onDelete={(id: string) => deleteItem(pallet.tempId)}
        />
      ))}
    </>
  );

  return (
    <OrderFormBase
      title="Añadir Bultos"
      description="Añade los detalles de los bultos que deseas enviar."
      formContent={formContent}
      itemsList={itemsList}
      listTitle="Bultos"
    />
  );
};

export default Page;
