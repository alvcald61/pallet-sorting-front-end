"use client";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { NavbarNested } from "./components/NavBar";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseLayout>{children}</BaseLayout>;
}
