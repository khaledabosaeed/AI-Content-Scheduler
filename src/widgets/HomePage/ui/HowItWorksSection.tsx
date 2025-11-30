"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { container, item } from "../../../components/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Sparkles, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <CalendarCheck className="h-10 w-10 text-blue-600" />,
    title: "Connect Accounts",
    desc: "Link all your social media accounts securely.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-blue-600" />,
    title: "Generate AI Content",
    desc: "Create captions, hashtags, and posts automatically.",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
    title: "Schedule & Publish",
    desc: "AI posts at the optimal times for engagement.",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
    title: "Analyze Results",
    desc: "Track performance and get improvement tips.",
  },
];

const HowItWorksSection: FC = () => (
  <motion.section
    id="steps"
    className="py-20 px-6 bg-white"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={container}
  >
    <div className="max-w-6xl mx-auto text-center mb-10">
      <motion.h3 variants={item} className="text-3xl font-bold mb-3">
        How It Works
      </motion.h3>
      <motion.p variants={item} className="text-gray-600">
        Step by step guide to automate your content scheduling.
      </motion.p>
    </div>

    <motion.div
      variants={container}
      className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto"
    >
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          variants={item}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="flex flex-col h-full justify-between items-center text-center p-6">
              <div className="flex flex-col items-center">
                <div className="mx-auto">{feature.icon}</div>
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

export default HowItWorksSection;
