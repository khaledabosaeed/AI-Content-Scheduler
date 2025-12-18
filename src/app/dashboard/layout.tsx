import DashboardLayout from "@/widgets/dashboard/_components/DashboardLayout";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
