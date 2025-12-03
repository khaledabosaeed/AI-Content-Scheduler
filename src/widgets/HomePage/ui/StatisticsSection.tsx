"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/shared/components/lib/animations";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Sparkles, CalendarCheck, BarChart3, Users } from "lucide-react";

const stats = [
  {
    icon: <Sparkles className="h-10 w-10 text-blue-600" />,
    title: "Content Requests Sent",
    value: "32,800+",
    description: "Prompts processed by the AI engine."
  },
  {
    icon: <CalendarCheck className="h-10 w-10 text-blue-600" />,
    title: "AI Content Generated",
    value: "18,400+",
    description: "Captions, ideas, and long-form content created."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
    title: "Scheduled Posts",
    value: "12,900+",
    description: "Posts successfully scheduled across all platforms."
  },
  {
    icon: <Users className="h-10 w-10 text-blue-600" />,
    title: "Connected Accounts",
    value: "1,540+",
    description: "Social media profiles linked to the system."
  }
];


const StatisticsSection: FC = () => (
  <motion.section
    id="statistics"
    className="py-20 px-6 bg-white h-screen"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={container}
  >
    <div className="max-w-6xl mx-auto text-center mb-10">
      <motion.h3 variants={item} className="text-3xl font-bold mb-3">Performance Highlights</motion.h3>
      <motion.p variants={item} className="text-gray-600">
        Real metrics that showcase the efficiency your content team gains.
      </motion.p>
    </div>

    <motion.div variants={container} className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          variants={item}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full flex flex-col justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-300 py-6 rounded-2xl">
            <CardContent className="flex flex-col items-center text-center p-4">
              {stat.icon}
              <p className="font-semibold text-lg mt-3">{stat.title}</p>
              <p className="text-gray-600 text-sm mt-1 font-medium">{stat.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </motion.section>
);

export default StatisticsSection;
