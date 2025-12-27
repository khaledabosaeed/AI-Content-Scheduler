"use client"

import { type FC, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/shared/components/ui/button" 
import { Badge } from "@/shared/components/ui/badge" 
import { container, fadeInUp, scaleIn, slideInLeft, slideInRight } from "@/shared/components/lib/animations"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, TrendingUp, Users, Zap, CheckCircle, ArrowRight, Play } from "lucide-react"

// Stats data
const stats = [
  { id: 1, value: "10K+", label: "Active Users", icon: Users },
  { id: 2, value: "99.9%", label: "Uptime", icon: TrendingUp },
  { id: 3, value: "50M+", label: "Posts Generated", icon: Sparkles },
]

// Features highlights
const features = ["Multi-platform scheduling", "AI-powered content generation", "Real-time analytics"]

const HeroSection: FC = () => {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.section
      id="hero"
      initial="hidden"
      animate="show"
      variants={container}
      className="
        relative min-h-screen flex items-center justify-center overflow-hidden
        bg-gradient-to-br
        from-[hsl(var(--background))]
        
        to-[hsl(var(--primary))]
      "
      dir="ltr"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"
          style={{ maskImage: "radial-gradient(ellipse at center, black, transparent 70%)" }}
        />
        <motion.div
          className="absolute -top-48 -right-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* TEXT SIDE */}
          <motion.div variants={slideInLeft} className="flex flex-col space-y-8 text-center lg:text-left order-2 lg:order-1">
            
            {/* Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
              <Badge
                variant="outline"
                className="gap-2 px-4 py-2 text-sm border-primary/20 bg-primary/5 backdrop-blur-sm"
              >
                <Zap className="w-4 h-4 text-primary" />
                AI-Powered Platform
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-foreground">
                Schedule & Grow with{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text">
                    AI-powered
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-primary/10 blur-xl"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </span>{" "}
                Content
              </h1>

              <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Plan, generate and publish posts across all platforms with smart automation and real-time analytics—all
                in one place.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-foreground/85"
                >
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </Button>
              </Link>

              <Link href="https://www.youtube.com/watch?v=0eeD8Umb9B4" className="w-full sm:w-auto" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto group border-2 hover:bg-accent/50 backdrop-blur-sm transition-all duration-300 bg-transparent"
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex flex-col items-center lg:items-start gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/60">{stat.label}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* IMAGE SIDE */}
          <motion.div
            variants={slideInRight}
            style={{ y: mounted ? y : 0, opacity: mounted ? opacity : 1 }}
            className="relative order-1 lg:order-2"
          >
            <motion.div variants={scaleIn} className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
              <motion.div
                className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl"
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              <motion.div className="relative w-full h-full flex items-center justify-center"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <div className="relative w-full h-full max-w-lg">
                  <Image
                    src="/Chat bot-rafiki.png"
                    alt="AI Content Illustration"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                className="absolute top-10 -left-4 sm:left-0 p-3 sm:p-4 bg-card/80 backdrop-blur-md rounded-xl shadow-xl border border-border/50"
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">AI Generated</p>
                    <p className="text-xs text-foreground/60">In seconds</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-10 -right-4 sm:right-0 p-3 sm:p-4 bg-card/80 backdrop-blur-md rounded-xl shadow-xl border border-border/50"
                animate={{ y: [0, 10, 0], rotate: [2, -2, 2] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">+247%</p>
                    <p className="text-xs text-foreground/60">Engagement</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default HeroSection
