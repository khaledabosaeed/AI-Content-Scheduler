"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { container, item } from "../../../components/lib/animations";
import Link from "next/link";

const CTASection: FC = () => (
  <motion.section
    id="cta"
    className="py-24 px-6 bg-indigo-600 text-white text-center"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={container}
  >
    <motion.div variants={item} className="max-w-4xl mx-auto">
      <h3 className="text-4xl font-bold mb-4">Start Scheduling Like a Pro</h3>
      <p className="mb-8 opacity-90">
        Sign up today and automate your social media posts with AI-powered
        tools.
      </p>
      <Link href="/register">
        <Button variant="default" size="lg">
          Get Started
        </Button>
      </Link>
    </motion.div>
  </motion.section>
);

export default CTASection;
