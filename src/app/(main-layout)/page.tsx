"use client";

import React, { useEffect, useState, useRef } from "react";
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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
  const currentRef = sectionRefs.current[visibleIndex];
  if (!currentRef) return;

  const delta = Math.sign(e.deltaY);
  const tolerance = 2; // فرق صغير لتجنب التوقف عند نهاية السكشن

  const canScrollDown =
    currentRef.scrollTop + currentRef.clientHeight < currentRef.scrollHeight - tolerance;
  const canScrollUp = currentRef.scrollTop > tolerance;

  if ((delta > 0 && canScrollDown) || (delta < 0 && canScrollUp)) {
    return; // تمرير داخلي → لا نغير visibleIndex
  }

  if (isScrolling) return;
  setIsScrolling(true);

  setVisibleIndex((prev) => {
    let next = prev + delta;
    if (next < 0) next = 0;
    if (next >= sections.length) next = sections.length - 1;
    return next;
  });

  setTimeout(() => setIsScrolling(false), 800);
};


    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isScrolling, setVisibleIndex, visibleIndex]);

  const variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={visibleIndex}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
          }}
        >
          <div
            ref={(el) => (sectionRefs.current[visibleIndex] = el)}
            style={{
              height: "100%",
              overflowY: "auto", // ✅ السماح بالتمرير داخل السكشن
            }}
          >
            {React.createElement(sections[visibleIndex])}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
