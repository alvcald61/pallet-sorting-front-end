"use client";

interface OrderInformationCardProps {
  createdAt: string;
  amount?: number | null;
  fromAddress: string;
  toAddress: string;
  totalWeight: number;
  totalVolume: number;
  gpsLink?: string;
  fromAddressLink?: string;
  toAddressLink?: string;
}

export default function OrderInformationCard({
  createdAt,
  amount,
  fromAddress,
  toAddress,
  totalWeight,
  totalVolume,
  gpsLink,
  fromAddressLink,
  toAddressLink,
}: OrderInformationCardProps) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        Order Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
        <div>
          <p className="text-gray-500">Order Date</p>
          <p className="font-medium text-gray-800">{createdAt}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Amount</p>
          <p className="font-medium text-gray-800">
            {amount ? amount : "Pending"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Source Address</p>
          <p className="font-medium text-gray-800">{fromAddress}</p>
        </div>
        <div>
          <p className="text-gray-500">Destiny Address</p>
          <p className="font-medium text-gray-800">{toAddress}</p>
        </div>
        <div>
          <p className="text-gray-500">Peso total</p>
          <p className="font-medium text-gray-800">{totalWeight}</p>
        </div>
        <div>
          <p className="text-gray-500">Volumen total</p>
          <p className="font-medium text-green-600">{totalVolume}</p>
        </div>
        {gpsLink && (
          <div>
            <p className="text-gray-500">Link de ubicacion</p>
            <a href={gpsLink} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 underline break-all">
              Ver en mapa
            </a>
          </div>
        )}
        {fromAddressLink && (
          <div>
            <p className="text-gray-500">Link de mapa de recojo</p>
            <a href={fromAddressLink} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 underline break-all">
              Ver en mapa
            </a>
          </div>
        )}
        {toAddressLink && (
          <div>
            <p className="text-gray-500">Link de mapa de entrega</p>
            <a href={toAddressLink} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 underline break-all">
              Ver en mapa
            </a>
          </div>
        )}
      </div>

      {/* Embedded map of delivery address */}
      {toAddress && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Mapa de entrega</p>
          <iframe
            title="Mapa de dirección de entrega"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(toAddress)}&output=embed&hl=es`}
            width="100%"
            height="300"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}
