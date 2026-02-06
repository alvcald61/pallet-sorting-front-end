"use server";
import {
  getOrderById,
  getOrderStatus,
  getDistributionImg,
} from "@/lib/api/order/orderApi";
import { getTransportHistory, TransportHistoryEntry } from "@/lib/api/transport/transportApi";
import OrderHeaderActions from "../components/OrderHeaderActions";
import OrderStatusBadge from "../components/OrderStatusBadge";
import DeliveryStatusTimeline from "../components/DeliveryStatusTimeline";
import DocumentUploadZone from "../components/DocumentUploadZone";
import InitiateRouteButton from "../components/InitiateRouteButton";
import TransportFlow from "../components/TransportFlow";
import OrderInformationCard from "../components/OrderInformationCard";
import TruckAndDriverCard from "../components/TruckAndDriverCard";
import PackagesCard from "../components/PackagesCard";
import { Image } from "@mantine/core";
import { OrderStatus } from "@/lib/utils/enums";

type PageParams = {
  params: Promise<{ orderId: string }>;
};

export default async ({ params }: PageParams) => {
  const { orderId } = await params;
  const order = (await getOrderById(orderId)).data;
  const status = await getOrderStatus(orderId);
  const image = await getDistributionImg(orderId);

  // Fetch transport history for delivery timeline
  let transportHistory: TransportHistoryEntry[] = [];
  try {
    const historyResponse = await getTransportHistory(orderId);
    transportHistory = historyResponse.data || [];
  } catch (error) {
    console.error("Error fetching transport history:", error);
  }

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-40 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Order Status Banner - Prominent Display */}
        {/* <div className="mb-8">
          <OrderStatusBadge status={order.orderStatus} variant="banner" />
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <OrderHeaderActions
              orderId={orderId}
              initialAmount={order.amount}
              orderStatus={order.orderStatus}
              orderGpsLink={order.gpsLink}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <OrderInformationCard
              createdAt={order.createdAt}
              amount={order.amount}
              fromAddress={order.fromAddress}
              toAddress={order.toAddress}
              totalWeight={order.totalWeight}
              totalVolume={order.totalVolume}
              gpsLink={order.gpsLink}
              fromAddressLink={order.fromAddressLink}
              toAddressLink={order.toAddressLink}
            />
            {order.orderType !== "BULK" ? (
              <div className="bg-white  p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900  mb-4">
                  Distribucion del camion
                </h3>
                <div className="overflow-x-auto">
                  <Image
                    style={{ borderColor: "black", borderWidth: "1px" }}
                    src={image ? `data:image/png;base64,${image}` : ""}
                    h={300}
                    w="auto"
                    fit="contain"
                  />
                </div>
              </div>
            ) : null}
            <TruckAndDriverCard truck={order.truck} driver={order.driver} />
            <PackagesCard
              orderType={order.orderType}
              packages={order.packages}
            />

            {order.orderStatus === OrderStatus.APPROVED &&
              order.documents &&
              order.documents.length > 0 && (
                <div className="bg-white  p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900  mb-4">
                    Documentos Requeridos
                  </h3>
                  <DocumentUploadZone
                    orderId={order.id}
                    documents={order.documents}
                    requiredDocuments={["Factura", "Comprobante de entrega"]}
                  />
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <InitiateRouteButton
                      orderId={order.id}
                      orderStatus={order.orderStatus}
                      isDocumentPending={order.documentPending}
                      documents={order.documents}
                      currentTransportStatus={order.transportStatus}
                    />
                  </div>
                </div>
              )}
          </div>
          {(order.orderStatus === OrderStatus.APPROVED ||
            order.orderStatus === OrderStatus.IN_PROGRESS ||
            order.orderStatus === OrderStatus.DELIVERED) &&
            order.transportStatus && (
              <div className="lg:col-span-1">
                {order.transportStatus && transportHistory.length > 0 ? (
                  <DeliveryStatusTimeline
                    orderId={orderId}
                    history={transportHistory}
                    currentStatus={order.transportStatus}
                  />
                ) : null}
              </div>
            )}
        </div>
      </div>
    </main>
  );
};
