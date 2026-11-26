import React from "react";
import { WasteBankLayoutClient } from "@/components/bank/sidebar-layout";

export default function WasteBankLayout({ children }: { children: React.ReactNode }) {
  return <WasteBankLayoutClient>{children}</WasteBankLayoutClient>;
}
