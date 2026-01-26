"use client";

interface ShippingDetailsCardProps {
  fromAddress: string;
  toAddress: string;
  fromAddressDistrict?: string | null;
  fromAddressCity?: string | null;
  fromAddressState?: string | null;
  toAddressCity?: string | null;
  toAddressState?: string | null;
  date?: string | null;
  time?: string | null;
}

export default function ShippingDetailsCard({
  fromAddress,
  toAddress,
  fromAddressDistrict,
  fromAddressCity,
  fromAddressState,
  toAddressCity,
  toAddressState,
  date,
  time,
}: ShippingDetailsCardProps) {
  const fromAddressFormatted = fromAddressDistrict
    ? `${fromAddress}, ${fromAddressDistrict}, ${fromAddressCity}, ${fromAddressState}`
    : fromAddress;

  const toAddressFormatted = toAddressCity
    ? `${toAddress}, ${toAddressCity}, ${toAddressState}`
    : toAddress;

  return (
    <div className="flex flex-col items-stretch justify-start rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <p className="text-[#212529] text-lg font-bold leading-tight tracking-[-0.015em]">
          Shipping Details
        </p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <div className="flex flex-col gap-1">
          <p className="text-gray-500 text-sm font-normal leading-normal">
            Direccion de recojo
          </p>
          <p className="text-[#212529] text-sm font-normal leading-normal">
            {fromAddressFormatted}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-gray-500 text-sm font-normal leading-normal">
            Direccion de destino
          </p>
          <p className="text-[#212529] text-sm font-normal leading-normal">
            {toAddressFormatted}
          </p>
        </div>
        {date && (
          <div className="flex flex-col gap-1">
            <p className="text-gray-500 text-sm font-normal leading-normal">
              Fecha de recojo
            </p>
            <p className="text-[#212529] text-sm font-normal leading-normal">
              {date}
            </p>
          </div>
        )}
        {time && (
          <div className="flex flex-col gap-1">
            <p className="text-gray-500 text-sm font-normal leading-normal">
              Hora de recojo
            </p>
            <p className="text-[#212529] text-sm font-normal leading-normal">
              {time}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
