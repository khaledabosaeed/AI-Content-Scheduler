import { BackToHome } from "@/shared/ui/BackTohoem";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (<div>
        <BackToHome />
        {children}
    </div>);
}