import { BackToHome } from "@/shared/ui/BackTohoem";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative">
            <div className="absolute top-4 right-4 z-10">
                <BackToHome />
                <ThemeToggle/>
            </div>
            {children}
        </div>
    );
}