"use client";

import { Anchor, Breadcrumbs, Title } from "@mantine/core";
import { useInvoiceBalance } from "@/lib/hooks/useInvoice";
import { useAuth } from "@/lib/hooks/useAuth";
import BalanceSummaryCards from "./components/BalanceSummaryCards";
import ClientInvoiceTable from "./components/ClientInvoiceTable";

const BalancePage = () => {
  const { user } = useAuth();
  const userId = user ? parseInt(user.id, 10) : 0;
  const { data: balanceData, isLoading } = useInvoiceBalance(userId);
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
      {userId > 0 && <ClientInvoiceTable userId={userId} />}
    </div>
  );
};

export default BalancePage;
