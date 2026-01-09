import React from "react";

const BulkSummaryTable = ({ bulk }) => {
  return (
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-gray-500  uppercase bg-gray-50 ">
        <tr>
          <th className="px-6 py-3 text-center" scope="col">
            Volumen
          </th>
          <th className="px-6 py-3 text-center" scope="col">
            Peso
          </th>
          <th className="px-6 py-3 text-right" scope="col">
            Cantidad
          </th>
        </tr>
      </thead>
      <tbody>
        {bulk.map((item, index) => {
          return (
            <tr className="bg-white  border-b ">
              <td className="px-6 py-4 text-center">{`${item.volume} m3`}</td>
              <td className="px-6 py-4 text-center">{`${item.weight} kg`}</td>
              <td className="px-6 py-4 text-right">{`${item.quantity}`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BulkSummaryTable;
