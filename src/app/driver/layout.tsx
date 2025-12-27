"use client";
import { BaseLayout } from "@/components/layouts/BaseLayout";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseLayout>{children}</BaseLayout>;
}
