"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CalendarCheck, BarChart3 } from "lucide-react";
import { container, item } from "@/components/lib/animations";

const features = [
  {
    icon: Sparkles,
    title: "Generate High-Impact Posts",
    desc: "Turn short prompts into ready-to-publish posts, captions and hashtags optimized for each platform.",
  },
  {
    icon: CalendarCheck,
    title: "Auto-Schedule for Peak Times",
    desc: "Our AI analyzes past engagement to schedule posts when your audience is most active — automatically.",
  },
  {
    icon: BarChart3,
    title: "Actionable Analytics & Tips",
    desc: "See what’s working at a glance and get data-driven suggestions to boost reach and conversions.",
  },
];

const FeaturesSection: FC = () => (
  <motion.section
    id="features"
    className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500"
    style={{
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
    }}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    variants={container}
    aria-labelledby="features-heading"
  >
    <div className="max-w-6xl mx-auto text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
      <motion.h3
        id="features-heading"
        variants={item}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 md:mb-6 tracking-tight"
        style={{ color: "hsl(var(--text-primary))" }}
      >
        Powerful features that grow your reach
      </motion.h3>

      <motion.p
        variants={item}
        className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2"
        style={{ color: "hsl(var(--text-secondary))" }}
      >
        From AI-generated content to smart scheduling and clear performance
        insights — everything you need to save time and scale consistently
        across channels.
      </motion.p>
    </div>

    <motion.ul
      variants={container}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto"
      role="list"
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.li
            key={feature.title}
            variants={item}
            className="h-full"
            role="listitem"
            aria-labelledby={`feature-title-${index}`}
          >
            <motion.div
              whileHover={{ translateY: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="h-full"
            >
              <Card
                className="h-full rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                      delay: index * 0.06,
                    }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "hsl(var(-accent-)/20)", // خلي الخلفية أفتح
                      transition: "background-color 0.3s",
                    }}
                    aria-hidden
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{
                        color: "hsl(var(--accent)/90)", // خلي الأيقونة أغمق وأكثر وضوح
                        transition: "color 0.3s",
                      }}
                    />
                  </motion.div>

                  <h4
                    id={`feature-title-${index}`}
                    className="text-lg sm:text-xl font-semibold"
                    style={{ color: "hsl(var(--text-primary))" }}
                  >
                    {feature.title}
                  </h4>

                  <p
                    className="text-sm leading-relaxed max-w-sm"
                    style={{ color: "hsl(var(--text-secondary))" }}
                  >
                    {feature.desc}
                  </p>

                  <span
                    className="mt-2 text-xs"
                    style={{ color: "hsl(var(--text-disabled))" }}
                  >
                    Works with Instagram, Facebook, X and LinkedIn
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          </motion.li>
        );
      })}
    </motion.ul>
  </motion.section>
);

export default FeaturesSection;
