"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/shared/components/lib/animations";
import { Users, Zap, CalendarCheck } from "lucide-react";
import { FloatingIcons } from "@/shared/ui/floating-icons";

const aboutFeatures = [
  {
    icon: Users,
    title: "Centralized Dashboard",
    desc: "Manage all your social media accounts in one place.",
  },
  {
    icon: Zap,
    title: "AI Suggestions",
    desc: "Get smart recommendations to boost engagement.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Scheduling",
    desc: "Plan and publish content effortlessly across platforms.",
  },
];

const AboutSection: FC = () => {
  return (
    <motion.section
      id="about"
      className="
        relative 
        min-h-screen
        w-full 
        flex flex-col 
        justify-center 
        items-center 
        px-4 sm:px-6 lg:px-8
        snap-start
        
        bg-[linear-gradient(to_bottom,hsl(var(--background))_0%,hsl(var(--elevated))_100%)]
        text-[hsl(var(--text-primary))]
      "
      initial="hidden"
      animate="show"
      exit="exit"
      variants={container}
    >
      <FloatingIcons/>
      {/* Title */}
      <div className="max-w-6xl w-full text-center mb-10">
        <motion.h2
          variants={item}
          className="
            text-4xl sm:text-5xl lg:text-6xl 
            font-extrabold mb-4 tracking-tight
            bg-[linear-gradient(to_right,hsl(var(--primary))_0%,hsl(var(--secondary))_100%)]
             bg-clip-text
          "
        >
          About AI Scheduler
        </motion.h2>

        <motion.p
          variants={item}
          className="
            text-lg sm:text-xl 
            max-w-3xl mx-auto 
            leading-relaxed
            text-[hsl(var(--text-secondary))]
          "
        >
          Simplifying social media management with AI-powered automation and
          insights to save time and boost your presence.
        </motion.p>
      </div>

      {/* Features */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
      >
        {aboutFeatures.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="
                rounded-2xl 
                p-8 
                shadow-lg 
                flex flex-col 
                items-center 
                text-center 
                border 
                transition-all
                duration-300

                bg-[hsl(var(--card))]
                border-[hsl(var(--primary)/0.2)]
              "
            >
              <div className="mb-4 text-[hsl(var(--primary))]">
                <Icon className="h-10 w-10" />
              </div>

              <h3
                className="
                  font-semibold text-2xl mb-2 
                  text-[hsl(var(--primary))]
                "
              >
                {feature.title}
              </h3>

              <p className="text-[hsl(var(--text-secondary))]">
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
