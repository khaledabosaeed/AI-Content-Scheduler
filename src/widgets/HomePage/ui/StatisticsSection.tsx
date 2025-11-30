"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/components/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Users, Sparkles, BarChart3 } from "lucide-react";

const stats = [
  { icon: <CalendarCheck className="h-10 w-10 text-blue-600" />, title: "Posts Scheduled", value: "25k+" },
  { icon: <Users className="h-10 w-10 text-blue-600" />, title: "Active Users", value: "5k+" },
  { icon: <Sparkles className="h-10 w-10 text-blue-600" />, title: "AI Generated Content", value: "50k+" },
  { icon: <BarChart3 className="h-10 w-10 text-blue-600" />, title: "Engagement Rate", value: "95%" },
];

const StatisticsSection: FC = () => (
  <motion.section
    id="statistics"
    className="py-20 px-6 bg-gray-50"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={container}
  >
    <div className="max-w-6xl mx-auto text-center mb-10">
      <motion.h3 variants={item} className="text-3xl font-bold mb-3">
        Our Impact
      </motion.h3>
      <motion.p variants={item} className="text-gray-600">
        Numbers that show how powerful AI Scheduler is.
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
          <Card className="h-full flex flex-col justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-300 py-6">
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
