"use client";

import BulkSummaryTable from "./BulkSummaryTable";
import PalletSummaryTable from "./PalletSummaryTable";

interface PackagesCardProps {
  orderType: string;
  packages: any[];
  title?: string;
}

export default function PackagesCard({
  orderType,
  packages,
  title = "Paquetes",
}: PackagesCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        {orderType === "BULK" ? (
          <BulkSummaryTable bulk={packages} />
        ) : (
          <PalletSummaryTable pallets={packages} />
        )}
      </div>
    </div>
  );
}
