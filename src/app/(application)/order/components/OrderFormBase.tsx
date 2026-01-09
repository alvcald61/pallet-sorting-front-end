"use client";
import React, { useEffect, useState, ReactNode } from "react";
import { Breadcrumbs } from "@mantine/core";

interface OrderFormBaseProps {
  title: string;
  description: string;
  formContent: ReactNode;
  itemsList: ReactNode;
  listTitle?: string;
}

export const OrderFormBase: React.FC<OrderFormBaseProps> = ({
  title,
  description,
  formContent,
  itemsList,
  listTitle = "Pallets",
}) => {
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
                    {title}
                  </p>
                  <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                </div>
              </div>

              {formContent}

              <div className="flex flex-col gap-4 pt-8">
                <h3 className="text-xl font-bold leading-7">{listTitle}</h3>
                <div className="flex flex-col gap-4">{itemsList}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
