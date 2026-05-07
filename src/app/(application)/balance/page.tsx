"use client";

import { Anchor, Breadcrumbs, Title } from "@mantine/core";
import { useInvoiceBalance } from "@/lib/hooks/useInvoice";
import BalanceSummaryCards from "./components/BalanceSummaryCards";
import ClientInvoiceTable from "./components/ClientInvoiceTable";

const useCurrentClientId = (): number => {
  // TODO: replace with real auth context — e.g. useAuth() from authStore
  return 5;
};

const BalancePage = () => {
  const clientId = useCurrentClientId();
  console.log("Current client ID:", clientId);
  const { data: balanceData, isLoading } = useInvoiceBalance(clientId);
  const balance = balanceData?.data;

  return (
    <div className="flex flex-col w-full grow p-4 sm:p-10">
      <Breadcrumbs mb="md">
        <Anchor href="/">Dashboard</Anchor>
        <span>Mi Balance</span>
      </Breadcrumbs>

      <Title order={2} mb="lg">
        Mi Balance
      </Title>

      <BalanceSummaryCards balance={balance} isLoading={isLoading} />
      {clientId > 0 && <ClientInvoiceTable clientId={clientId} />}
    </div>
  );
};

export default BalancePage;
