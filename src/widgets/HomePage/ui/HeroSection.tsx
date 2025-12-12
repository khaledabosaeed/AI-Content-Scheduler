"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { container, item } from "@/shared/components/lib/animations";
import Image from "next/image";
import Link from "next/link";

const HeroSection: FC = () => (
  <motion.section
    id="hero"
    initial="hidden"
    animate="show"
    variants={container}
    className="relative py-16 sm:py-20 bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] lg:py-24 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center text-foreground transition-colors duration-500"
  >
    <div className="container mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
        {/* IMAGE SIDE */}
        <motion.div
          variants={item}
          className="relative w-full h-60 sm:h-72 md:h-80 lg:h-96 flex justify-center order-2 md:order-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-full h-full relative"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <Image
              src="/Chat bot-rafiki (3).png"
              alt="AI Content Illustration"
              fill
              className="object-contain drop-shadow-2xl"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
            />
          </motion.div>
        </motion.div>

        {/* TEXT SIDE */}
        <motion.div
          variants={item}
          className="text-center flex flex-col justify-center items-center md:text-left space-y-6 sm:space-y-8 order-1 md:order-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-[hsl(var(--primary-foreground))]  mb-3 sm:mb-4 leading-tight tracking-tight  transition-colors duration-500"
            >
              Schedule & Grow with
              <span className="block bg-clip-text bg-gradient-to-r from-primary  mt-2">
                AI-powered Content
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed  transition-colors duration-500">
              Plan, generate and publish posts across platforms with smart
              automation and analytics—all in one place.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 sm:gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto bg-primary border-primary-foreground border-2 border-solid text-primary-foreground hover:opacity-90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 text-primary hover:bg-primary/10 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </motion.section>
);

export default HeroSection;
