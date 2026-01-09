import OrderLayoutWrapper from "../components/OrderLayoutWrapper";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderLayoutWrapper
      orderType="BULK"
      basePath="bulk"
      stepsConfig={[
        { label: "First step", description: "Bultos" },
        { label: "Second step", description: "Envio y dirección" },
        { label: "Final step", description: "Resumen" },
      ]}
    >
      {children}
    </OrderLayoutWrapper>
  );
}
