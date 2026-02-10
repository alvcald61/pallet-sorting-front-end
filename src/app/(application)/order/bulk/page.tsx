"use client";

import { ImprovedOrderLayout } from "../components/ImprovedOrderLayout";
import { ImprovedBulkForm } from "../components/ImprovedBulkForm";
import { useOrderDraft } from "@/lib/hooks/useOrderDraft";
import { useEffect } from "react";

export default function BulkOrderPage() {
  // Auto-save draft
  useOrderDraft("bulk");

  return (
    <ImprovedOrderLayout
      orderType="bulk"
      currentStep={0}
      showSummary={true}
      showPricing={false}
    >
      <ImprovedBulkForm />
    </ImprovedOrderLayout>
  );
}
