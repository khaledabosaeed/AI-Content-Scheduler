"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/shared/components/lib/animations";
import { Users, Zap, CalendarCheck } from "lucide-react";

const aboutFeatures = [
  { icon: Users, title: "Centralized Dashboard", desc: "Manage all your social media accounts in one place." },
  { icon: Zap, title: "AI Suggestions", desc: "Get smart recommendations to boost engagement." },
  { icon: CalendarCheck, title: "Easy Scheduling", desc: "Plan and publish content effortlessly across platforms." },
];

const AboutSection: FC = () => {
  return (
    <motion.section
      id="about"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center min-h-screen"
      style={{
        background: "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--elevated)) 100%)",
        color: "hsl(var(--text-primary))",
        transition: "background 0.3s, color 0.3s",
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      {/* Title */}
      <div className="max-w-6xl w-full text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
        <motion.h2
          variants={item}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 md:mb-6 tracking-tight"
          style={{
            color: "hsl(var(--primary))",
            background: "linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transition: "color 0.3s, background 0.3s",
          }}
        >
          About AI Scheduler
        </motion.h2>
        <motion.p
          variants={item}
          className="text-base sm:text-lg md:text-xl mx-auto max-w-3xl leading-relaxed px-2"
          style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}
        >
          Simplifying social media management with AI-powered automation and insights to save time and boost your presence.
        </motion.p>
      </div>

      {/* Features */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto w-full"
      >
        {aboutFeatures.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="rounded-2xl p-8 shadow-lg flex flex-col items-center justify-center text-center border transition-all duration-300"
              style={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--primary)/20)",
                color: "hsl(var(--text-primary))",
              }}
            >
              <div
                className="mb-4"
                style={{ color: "hsl(var(--primary))", transition: "color 0.3s" }}
              >
                <Icon className="h-8 w-8" />
              </div>
              <h3
                className="font-semibold text-xl mb-2"
                style={{ color: "hsl(var(--primary))", transition: "color 0.3s" }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}>
                {feature.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};

export default AboutSection;
