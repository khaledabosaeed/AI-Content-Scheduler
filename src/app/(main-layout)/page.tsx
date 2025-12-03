import HeroSection from "@/widgets/HomePage/ui/HeroSection";
import FeaturesSection from "@/widgets/HomePage/ui/FeaturesSection";
import HowItWorksSection from "@/widgets/HomePage/ui/HowItWorksSection";
import StatisticsSection from "@/widgets/HomePage/ui/StatisticsSection";
import FAQSection from "@/widgets/HomePage/ui/FAQSection";
import CTASection from "@/widgets/HomePage/ui/CTASection";
import AboutSection from "@/widgets/HomePage/ui/AboutSection";
import PricingSection from "@/widgets/HomePage/ui/PricingSection";
import TestimonialsSection from "@/widgets/HomePage/ui/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
    </>
  );
}
