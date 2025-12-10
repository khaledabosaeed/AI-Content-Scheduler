"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSections } from "@/app/_providers/SectionsContext";

import HeroSection from "@/widgets/HomePage/ui/HeroSection";
import FeaturesSection from "@/widgets/HomePage/ui/FeaturesSection";
import HowItWorksSection from "@/widgets/HomePage/ui/HowItWorksSection";
import AboutSection from "@/widgets/HomePage/ui/AboutSection";
import PricingSection from "@/widgets/HomePage/ui/PricingSection";
import TestimonialsSection from "@/widgets/HomePage/ui/TestimonialsSection";
import FAQSection from "@/widgets/HomePage/ui/FAQSection";

const sections = [
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  AboutSection,
  PricingSection,
  TestimonialsSection,
  FAQSection,
];

export default function HomePage() {
  const { visibleIndex, setVisibleIndex } = useSections();
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      setIsScrolling(true);

      const delta = Math.sign(e.deltaY);
      setVisibleIndex((prev) => {
        let next = prev + delta;
        // منع القفزات عند الوصول للأول أو الأخير
        if (next < 0) next = 0;
        if (next >= sections.length) next = sections.length - 1;
        return next;
      });

      setTimeout(() => setIsScrolling(false), 800);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isScrolling, setVisibleIndex]);

  const variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={visibleIndex}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh" }}
        >
          {React.createElement(sections[visibleIndex])}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
