"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/shared/components/lib/animations";
import { Card, CardContent } from "@/shared/components/ui/card";
import { FloatingIcons } from "@/shared/ui/floating-icons";

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Social Media Manager",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "AI Scheduler saved me hours every week. Scheduling posts has never been easier!",
  },
  {
    name: "Mark Thompson",
    role: "Content Creator",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    text: "The AI content suggestions are amazing! My engagement has doubled.",
  },
  {
    name: "Sophia Lee",
    role: "Marketing Specialist",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Connecting all my social accounts and scheduling is super smooth now.",
  },
  {
    name: "David Kim",
    role: "Entrepreneur",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    text: "I love the analytics dashboard. It helps me track which content works best.",
  },
];

const TestimonialsSection: FC = () => (
  <motion.section
    id="testimonials"
    className="
      relative 
      min-h-screen
      w-full 
      flex flex-col 
      justify-center 
      items-center 
      px-4 sm:px-6 lg:px-8
      bg-[hsl(var(--background))]
      text-[hsl(var(--foreground))]
      transition-colors
    "
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={container}
  >
    <FloatingIcons/>
    {/* Section Title */}
    <div className="max-w-6xl mx-auto text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
      <motion.h3
        variants={item}
        className="
          text-[hsl(var(--primary))]
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
          font-extrabold 
          mb-3 sm:mb-4 
          tracking-tight
          transition-colors
        "
      >
        What Our Users Say
      </motion.h3>

      <motion.p
        variants={item}
        className="
          text-[hsl(var(--text-secondary))]
          text-base sm:text-lg md:text-xl 
          max-w-3xl mx-auto 
          leading-relaxed
          transition-colors
        "
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
            className="
              h-full 
              flex flex-col 
              items-center 
              shadow-md 
              hover:shadow-xl 
              transition-all duration-300
              bg-[hsl(var(--card))]
              text-[hsl(var(--card-foreground))]
            "
          >
            <CardContent className="flex flex-col items-center text-center p-6">

              {/* Avatar */}
              <img
                src={test.avatar}
                alt={test.name}
                className="
                  w-16 h-16 
                  rounded-full 
                  mb-4 
                  object-cover 
                  shadow-md 
                  hover:shadow-lg 
                  transition-shadow
                "
              />

              {/* Testimonial Text */}
              <p
                className="
                  text-[hsl(var(--primary))]
                  font-medium 
                  mb-3 
                  leading-relaxed
                  transition-colors
                "
              >
                "{test.text}"
              </p>

              {/* Name */}
              <p
                className="
                  text-[hsl(var(--primary))]
                  font-semibold
                  transition-colors
                "
              >
                {test.name}
              </p>

              {/* Role */}
              <p
                className="
                  text-[hsl(var(--text-secondary))]
                  text-sm
                  transition-colors
                "
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
