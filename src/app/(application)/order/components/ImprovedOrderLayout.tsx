"use client";

import { Grid, Container } from "@mantine/core";
import { OrderStepper } from "./OrderStepper";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import { ReactNode } from "react";

interface ImprovedOrderLayoutProps {
  orderType: "bulk" | "pallet";
  currentStep: number;
  children: ReactNode;
  showSummary?: boolean;
  showPricing?: boolean;
}

/**
 * Improved layout for order creation with stepper and summary panel
 */
export function ImprovedOrderLayout({
  orderType,
  currentStep,
  children,
  showSummary = true,
  showPricing = false,
}: ImprovedOrderLayoutProps) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <Container size="xl" py="xl">
        {/* Stepper */}
        <OrderStepper
          orderType={orderType}
          currentStep={currentStep}
        />

        {/* Main content with sidebar */}
        <Grid mt="xl" gutter="lg">
          {/* Main content area */}
          <Grid.Col span={{ base: 12, lg: showSummary ? 8 : 12 }}>
            {children}
          </Grid.Col>

          {/* Summary sidebar */}
          {showSummary && (
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <div style={{ position: "sticky", top: 20 }}>
                <OrderSummaryPanel
                  orderType={orderType}
                  showPricing={showPricing}
                />
              </div>
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </div>
  );
}
