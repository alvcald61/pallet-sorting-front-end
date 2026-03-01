import React from "react";
import { Pallet } from "@/lib/types/palletType";

const PalletSummaryTable = ({ pallets }: { pallets: Pallet[] }) => {
  return (
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-gray-500  uppercase bg-gray-50 ">
        <tr>
          <th className="px-3 sm:px-6 py-3 text-center" scope="col">
            Dimensiones
          </th>
          <th className="px-3 sm:px-6 py-3 text-center" scope="col">
            Peso
          </th>
          <th className="px-3 sm:px-6 py-3 text-right" scope="col">
            Cantidad
          </th>
        </tr>
      </thead>
      <tbody>
        {pallets.map((item, index) => {
          return (
            <tr className="bg-white  border-b ">
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">{`${item.width}m  x ${item.length}m x ${item.height}m`}</td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">{`${item.weight} kg`}</td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">{`${item.quantity}`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PalletSummaryTable;
