"use client";
import React, { useEffect } from "react";

import useOrderStore from "@/lib/store/OrderStore";
import ShippingDetailsCard from "../../components/ShippingDetailsCard";
import PackagesCard from "../../components/PackagesCard";

const Page = () => {
  const { bulkOrder, address } = useOrderStore();

  useEffect(() => {
    console.log("bulkOrder", bulkOrder);
    console.log("address", address);
  }, [address, bulkOrder]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-8 p-4">
              <div className="lg:col-span-2 flex flex-col gap-8">
                <ShippingDetailsCard
                  fromAddress={address.fromAddress.address}
                  toAddress={address.toAddress.address}
                  fromAddressDistrict={address.fromAddress.district}
                  fromAddressCity={address.fromAddress.city}
                  fromAddressState={address.fromAddress.state}
                  toAddressCity={address.toAddress.city}
                  toAddressState={address.toAddress.state}
                  date={address.date}
                  time={address.time}
                />
                <PackagesCard
                  orderType="BULK"
                  packages={bulkOrder}
                  title="Detalle de carga"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
