"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { container, item } from "@/shared/components/lib/animations";
import Link from "next/link";

const CTASection: FC = () => (
  <motion.section
    id="cta"
    className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-center w-full overflow-hidden"
    style={{
      backgroundColor: "hsl(var(--accent))",
      color: "hsl(var(--accent-foreground))",
      transition: "background-color 0.3s, color 0.3s",
    }}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={container}
  >
    {/* Background decoration */}
    <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
      <div
        className="absolute -top-32 -right-32 w-64 h-64 sm:w-80 sm:h-80 rounded-full mix-blend-multiply filter blur-3xl"
        style={{ backgroundColor: "hsl(var(--foreground))" }}
      ></div>
      <div
        className="absolute -bottom-32 -left-32 w-64 h-64 sm:w-80 sm:h-80 rounded-full mix-blend-multiply filter blur-3xl"
        style={{ backgroundColor: "hsl(var(--foreground))" }}
      ></div>
    </div>

    <motion.div variants={item} className="max-w-4xl mx-auto relative z-10 px-2 sm:px-4">
      <h3
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 sm:mb-3 md:mb-4 lg:mb-6 tracking-tight leading-tight"
        style={{ color: "hsl(var(text-primary))", transition: "color 0.3s" }}
      >
        Start Scheduling Like a Pro
      </h3>
      <p
        className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed opacity-90"
        style={{ color: "hsl(var(--text-primary))", transition: "color 0.3s" }}
      >
        Sign up today and automate your social media posts with AI-powered tools.
      </p>
      <Link href="/register">
        <Button
          variant="default"
          size="lg"
          className="w-full sm:w-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          style={{
            backgroundColor: "hsl(var(--card-foreground))",
            color: "hsl(var(--primary))",
            transition: "background-color 0.3s, color 0.3s",
          }}
        >
          Get Started
        </Button>
      </Link>
    </motion.div>
  </motion.section>
);

export default CTASection;
