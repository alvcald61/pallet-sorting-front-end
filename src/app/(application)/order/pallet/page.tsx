"use client";

import { ImprovedOrderLayout } from "../components/ImprovedOrderLayout";
import { ImprovedPalletForm } from "../components/ImprovedPalletForm";
import { useOrderDraft } from "@/lib/hooks/useOrderDraft";

export default function PalletOrderPage() {
  // Auto-save draft
  useOrderDraft("pallet");

  return (
    <ImprovedOrderLayout
      orderType="pallet"
      currentStep={0}
      showSummary={true}
      showPricing={false}
    >
      <ImprovedPalletForm />
    </ImprovedOrderLayout>
  );
}
