"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/shared/components/lib/animations";
import { Card, CardContent } from "@/shared/components/ui/card";

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Social Media Manager",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "AI Scheduler saved me hours every week. Scheduling posts has never been easier!"
  },
  {
    name: "Mark Thompson",
    role: "Content Creator",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    text: "The AI content suggestions are amazing! My engagement has doubled."
  },
  {
    name: "Sophia Lee",
    role: "Marketing Specialist",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Connecting all my social accounts and scheduling is super smooth now."
  },
  {
    name: "David Kim",
    role: "Entrepreneur",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    text: "I love the analytics dashboard. It helps me track which content works best."
  },
];

const TestimonialsSection: FC = () => (
  <motion.section
    id="testimonials"
    className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 w-full"
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
    {/* Section Title */}
    <div className="max-w-6xl mx-auto text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
      <motion.h3
        variants={item}
        style={{ color: "hsl(var(--primary))", transition: "color 0.3s" }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 tracking-tight"
      >
        What Our Users Say
      </motion.h3>
      <motion.p
        variants={item}
        style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}
        className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
      >
        Real feedback from people who love using AI Scheduler and how it transforms their social media workflow.
      </motion.p>
    </div>

    {/* Testimonials Grid */}
    <motion.div
      variants={container}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto"
    >
      {testimonials.map((test, idx) => (
        <motion.div
          key={idx}
          variants={item}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card
            className="h-full flex flex-col items-center shadow-md hover:shadow-xl transition-shadow duration-300"
            style={{
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              transition: "background-color 0.3s, color 0.3s, box-shadow 0.3s",
            }}
          >
            <CardContent className="flex flex-col items-center text-center p-6">
              {/* Avatar */}
              <img
                src={test.avatar}
                alt={test.name}
                className="w-16 h-16 rounded-full mb-4 object-cover shadow-md hover:shadow-lg transition-shadow"
              />
              {/* Testimonial Text */}
              <p
                style={{ color: "hsl(var(--primary))", transition: "color 0.3s" }}
                className="font-medium mb-3 leading-relaxed"
              >
                "{test.text}"
              </p>
              {/* Name & Role */}
              <p
                style={{ color: "hsl(var(--primary))", transition: "color 0.3s" }}
                className="font-semibold"
              >
                {test.name}
              </p>
              <p
                style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}
                className="text-sm"
              >
                {test.role}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </motion.section>
);

export default TestimonialsSection;
