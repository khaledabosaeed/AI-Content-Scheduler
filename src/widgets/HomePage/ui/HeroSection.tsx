"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { container, item } from "@/components/lib/animations";
import Link from "next/link";

const HeroSection: FC = () => (
  <motion.section
    initial="hidden"
    animate="show"
    variants={container}
    className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white py-24 px-6 text-center"
  >
    <motion.div variants={item} className="max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
        Schedule & Grow with AI-powered Content
      </h2>
      <p className="text-lg md:text-xl opacity-90 mb-8">
        Plan, generate and publish posts across platforms with smart automation
        and analytics.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/register">
          <Button variant="default" size="lg">
            Get Started
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="text-black">
          Watch Demo
        </Button>
      </div>
    </motion.div>
  </motion.section>
);

export default HeroSection;
