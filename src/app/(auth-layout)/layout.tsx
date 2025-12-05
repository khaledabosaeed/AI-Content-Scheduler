import { BackToHome } from "@/shared/ui/BackTohoem";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative">
            <div className="absolute top-4 right-4">
                <BackToHome />
            </div>
            {children}
        </div>
    );
}