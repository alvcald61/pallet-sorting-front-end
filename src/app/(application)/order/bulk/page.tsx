"use client";
import React from "react";
import useOrderStore from "@/lib/store/OrderStore";
import { Formik, Form, Field } from "formik";
import { object, number } from "yup";
import { require, positive, integer } from "@/lib/const";
import { OrderFormBase } from "../components/OrderFormBase";
import { BulkItem } from "../components/BulkItem";
import { Bulk } from "@/lib/types/bulkType";
import "./order.css";

// Validation schema
const bulkSchema = object({
  volume: number().required(require).positive(positive),
  weight: number().required(require).positive(positive),
  quantity: number().required(require).positive(positive).integer(integer),
  height: number().required(require).positive(positive),
});

// Initial form values
const initialValues = {
  volume: 0,
  weight: 0,
  quantity: 0,
  height: 0,
};

// Common field class name
const fieldClassName =
  "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

const Page = () => {
  const { addBulk, bulkOrder, deleteItem } = useOrderStore();

  const handleSubmit = (values: typeof initialValues) => {
    addBulk({ ...values, tempId: crypto.randomUUID() } as Bulk);
  };

  // Form field component
  const FormField = ({
    name,
    label,
    placeholder,
    unit,
    errors,
    touched,
  }: any) => (
    <label className="flex flex-col min-w-40 flex-1">
      <p className="text-base font-medium leading-normal pb-2">{label}</p>
      <div className="relative flex items-center">
        <Field
          className={fieldClassName}
          placeholder={placeholder}
          name={name}
          type="number"
        />
        {unit && (
          <span className="absolute right-4 text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
      {errors[name] && touched[name] && <div>{errors[name]}</div>}
    </label>
  );

  const formContent = (
    <Formik
      initialValues={initialValues}
      validationSchema={bulkSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-6 border-b border-border-light dark:border-border-dark pb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              name="volume"
              label="Volumen"
              placeholder="e.g., 20"
              unit="m³"
              errors={errors}
              touched={touched}
            />
            <FormField
              name="weight"
              label="Peso"
              placeholder="e.g., 5"
              unit="kg"
              errors={errors}
              touched={touched}
            />
            <FormField
              name="quantity"
              label="Cantidad"
              placeholder="e.g., 1"
              errors={errors}
              touched={touched}
            />
            <FormField
              name="height"
              label="Altura"
              placeholder="e.g., 1"
              unit="m"
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-200 px-5 py-3 text-base font-semibold text-text-light dark:text-text-dark hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark"
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
      {bulkOrder.map((bulk: Bulk, index: number) => (
        <BulkItem
          key={bulk.tempId}
          id={String(index + 1)}
          {...bulk}
          name="Bulto"
          onDelete={() => deleteItem(bulk.tempId)}
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
