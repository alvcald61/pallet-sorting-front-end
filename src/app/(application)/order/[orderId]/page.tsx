"use server";
import {
  getOrderById,
  getOrderStatus,
  getDistributionImg,
} from "@/lib/api/order/orderApi";
import OrderHeaderActions from "../components/OrderHeaderActions";
import DocumentUploadZone from "../components/DocumentUploadZone";
import InitiateRouteButton from "../components/InitiateRouteButton";
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
  // const [amount, setAmount] = useState<string | number>(0);
  const order = (await getOrderById(orderId)).data;
  console.log("order", order);
  const status = await getOrderStatus(orderId);
  const image = await getDistributionImg(orderId);
  console.log(status);

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-40 py-10">
      <div className="max-w-5xl mx-auto">
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
              order.documents.length > 0 &&
              order.isDocumentPending &&
              (
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
                      isDocumentPending={order.isDocumentPending}
                      documents={order.documents}
                    />
                  </div>
                </div>
              )}
          </div>
          {order.orderStatus === OrderStatus.REVIEW && (
            <div className="lg:col-span-1">
              <div className="bg-white  p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900  mb-6">
                  Estado del transporte
                </h3>
                <div className="relative">
                  <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-gray-200 "></div>
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <div className="z-10 flex-shrink-0 size-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-base">
                          {" "}
                          check{" "}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-primary">Pendiente</p>
                        <p className="text-sm text-gray-500 ">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="z-10 flex-shrink-0 size-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-base">
                          {" "}
                          local_shipping{" "}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-primary">Recogido</p>
                        <p className="text-sm text-gray-500 ">
                          {order.pickupDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="z-10 flex-shrink-0 size-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-base">
                          {" "}
                          package_2{" "}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-primary">En camino</p>
                        <p className="text-sm text-gray-500 ">July 20, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="z-10 flex-shrink-0 size-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-base">
                          {" "}
                          package_2{" "}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-primary">Entregado</p>
                        <p className="text-sm text-gray-500 ">July 20, 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
