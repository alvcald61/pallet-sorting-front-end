"use client";

import { ImprovedOrderLayout } from "../../components/ImprovedOrderLayout";
import { ImprovedAddressForm } from "../../components/ImprovedAddressForm";
import { useOrderDraft } from "@/lib/hooks/useOrderDraft";

export default function PalletAddressPage() {
  // Auto-save draft
  useOrderDraft("pallet");

  return (
    <ImprovedOrderLayout
      orderType="pallet"
      currentStep={1}
      showSummary={true}
      showPricing={false}
    >
      <ImprovedAddressForm />
    </ImprovedOrderLayout>
  );
}
