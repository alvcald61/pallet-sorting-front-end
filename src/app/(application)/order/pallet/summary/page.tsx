"use client";
import React, { useEffect } from "react";

import useOrderStore from "@/lib/store/OrderStore";
import ShippingDetailsCard from "../../components/ShippingDetailsCard";
import PackagesCard from "../../components/PackagesCard";

const Page = () => {
  const { bulkOrder, address, palletOrder } = useOrderStore();

  useEffect(() => {
    console.log("bulkOrder", bulkOrder);
    console.log("address", address);
  }, [address, bulkOrder]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            orderType="PALLET"
            packages={palletOrder}
            title="Detalle de carga"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
