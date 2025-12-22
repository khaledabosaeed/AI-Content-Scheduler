'use client';

import { useLogoutMutation } from "@/features/user/logout/useLogout";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/shared/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { NavLinks } from "./DashboardSidebar";
import { useRouter } from "next/navigation";

export function DashboardMobileMenuButton() {
  
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.replace("/login"),
    });
  };

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/10 hover:bg-white/15 text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[290px] p-0 bg-gradient-to-b from-slate-950 to-slate-900 text-white border-white/10"
        >
          <SheetHeader className="p-4 border-b border-white/10">
            <SheetTitle className="text-white">Menu</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1">
              <NavLinks
                variant="mobile"
                onNavigate={(href) => router.push(href)}
              />
            </div>

            <div className="p-4 border-t border-white/10">
              <SheetClose asChild>
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/10 hover:bg-white/15 text-white"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {logoutMutation.isPending ? "Logging out..." : "Log out"}
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}