"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/shared/components/lib/animations";
import {
  User,
  MessageCircle,
  CalendarCheck,
  Link2,
  Globe,
  Send,
} from "lucide-react";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const steps = [
  { icon: User, title: "Login / Register" },
  { icon: MessageCircle, title: "Chat with AI" },
  { icon: Send, title: "Receive AI Response" },
  { icon: CalendarCheck, title: "Set Scheduling" },
  { icon: Link2, title: "Connect Social Platforms" },
  { icon: Globe, title: "Publish" },
];

const platforms = [Instagram, Facebook, Twitter, Linkedin];

const FunStepsSection: FC = () => (
  <motion.section
    id="fun-steps"
    className="relative 
        min-h-screen           
        w-full 
        flex flex-col 
        justify-center 
        items-center 
        px-4 sm:px-6 lg:px-8"
    style={{
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      transition: "background-color 0.3s, color 0.3s",
    }}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={container}
  >
    {/* Title */}
    <div className="max-w-5xl w-full text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
      <motion.h2
        variants={item}
        style={{ color: "hsl(var(--text-primary))", transition: "color 0.3s" }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 md:mb-6 tracking-tight"
      >
        How AI Scheduler Works
      </motion.h2>
      <motion.p
        variants={item}
        style={{
          color: "hsl(var(--text-secondary))",
          transition: "color 0.3s",
        }}
        className="text-base sm:text-lg md:text-xl mx-auto max-w-3xl leading-relaxed"
      >
        Follow the simple steps to schedule your content like a pro!
      </motion.p>
    </div>

    {/* Steps */}
    <div className="relative w-full max-w-6xl mx-auto px-2 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                className="w-14 sm:w-16 md:w-18 h-14 sm:h-16 md:h-18 rounded-full flex items-center justify-center shadow-lg mb-3 flex-shrink-0"
                style={{
                  backgroundColor: "hsl(var(--primary)/15)", // دائرة أيقونات بلون ثيم
                  transition: "background-color 0.3s",
                }}
                whileHover={{ rotate: 5 }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{
                    color: "hsl(var(--primary-foreground))",
                    transition: "color 0.3s",
                  }}
                />
              </motion.div>

              <p
                className="font-semibold text-xs sm:text-sm md:text-base leading-tight"
                style={{
                  color: "hsl(var(--text-primary))",
                  transition: "color 0.3s",
                }}
              >
                {step.title}
              </p>

              {/* Social platform icons only at step 5 */}
              {idx === 4 && (
                <motion.div
                  className="flex justify-center gap-2 mt-3 flex-wrap"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {platforms.map((PlatformIcon, i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
                      style={{
                        backgroundColor: "hsl(var(--card))",
                        color: "hsl(var(--primary))",
                        transition: "background-color 0.3s, color 0.3s",
                      }}
                      whileHover={{ rotate: 10 }}
                    >
                      <PlatformIcon className="w-4 h-4" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  </motion.section>
);

export default FunStepsSection;
