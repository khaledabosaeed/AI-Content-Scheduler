"use cline";
import DashboardLayout from "@/widgets/dashboard/_components/DashboardLayout";
import { use } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
