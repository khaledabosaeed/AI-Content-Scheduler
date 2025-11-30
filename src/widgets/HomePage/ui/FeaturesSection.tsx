"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CalendarCheck, BarChart3 } from "lucide-react";
import { container, item } from "@/components/lib/animations";

const FeaturesSection: FC = () => (
  <motion.section
    id="features"
    className="py-20 px-6 bg-gray-50"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={container}
  >
    <div className="max-w-6xl mx-auto text-center mb-10">
      <motion.h3 variants={item} className="text-3xl font-bold mb-3">
        Powerful Features
      </motion.h3>
      <motion.p variants={item} className="text-gray-600">
        Everything you need to automate content scheduling like a pro.
      </motion.p>
    </div>

    <motion.div
      variants={container}
      className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
    >
      {[
        {
          icon: <Sparkles className="h-10 w-10 mb-3 text-blue-600" />,
          title: "AI Content Generation",
          desc: "Generate captions, hashtags & optimized posts instantly.",
        },
        {
          icon: <CalendarCheck className="h-10 w-10 mb-3 text-blue-600" />,
          title: "Smart Auto-Scheduling",
          desc: "AI picks the perfect posting time for max engagement.",
        },
        {
          icon: <BarChart3 className="h-10 w-10 mb-3 text-blue-600" />,
          title: "Analytics Dashboard",
          desc: "Track performance & understand what works best.",
        },
      ].map((feature, idx) => (
        <motion.div
          key={idx}
          variants={item}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="flex flex-col h-full justify-between items-center text-center p-6">
              <div className="flex flex-col items-center">
                {feature.icon}
                <p className="font-semibold text-lg mt-3">{feature.title}</p>
              </div>
              <p className="text-gray-600 text-sm mt-4">{feature.desc}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </motion.section>
);

export default FeaturesSection;
