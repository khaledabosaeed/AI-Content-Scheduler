import HeroSection from "@/widgets/HomePage/HeroSection";
import FeaturesSection from "@/widgets/HomePage/FeaturesSection";
import HowItWorksSection from "@/widgets/HomePage/ui/HowItWorksSection";
import IntegrationsSection from "@/widgets/HomePage/ui/IntegrationsSection";
import StatisticsSection from "@/widgets/HomePage/StatisticsSection";
import FAQSection from "@/widgets/HomePage/ui/FAQSection";
import CTASection from "@/widgets/HomePage/ui/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <IntegrationsSection />
      <StatisticsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
