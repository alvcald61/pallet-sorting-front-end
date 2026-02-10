"use client";

import { ImprovedOrderLayout } from "../../components/ImprovedOrderLayout";
import { ImprovedAddressForm } from "../../components/ImprovedAddressForm";
import { useOrderDraft } from "@/lib/hooks/useOrderDraft";

export default function BulkAddressPage() {
  // Auto-save draft
  useOrderDraft("bulk");

  return (
    <ImprovedOrderLayout
      orderType="bulk"
      currentStep={1}
      showSummary={true}
      showPricing={false}
    >
      <ImprovedAddressForm />
    </ImprovedOrderLayout>
  );
}
