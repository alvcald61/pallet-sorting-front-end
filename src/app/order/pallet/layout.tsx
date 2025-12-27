import OrderLayoutWrapper from "../components/OrderLayoutWrapper";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderLayoutWrapper
      orderType="TWO_DIMENSIONAL"
      basePath="pallet"
      stepsConfig={[
        { label: "First step", description: "Pallets" },
        { label: "Second step", description: "Envio y dirección" },
        { label: "Final step", description: "Resumen" },
      ]}
    >
      {children}
    </OrderLayoutWrapper>
  );
}
