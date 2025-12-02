"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { container, item } from "@/components/lib/animations";

const plans = [
  {
    name: "Elite",
    price: "$39",
    period: "/month",
    popular: false,
    features: [
      "Everything in Pro",
      "10+ connected platforms",
      "Team collaboration",
      "Content analytics dashboard",
      "AI optimal posting time",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    popular: true,
    features: [
      "Unlimited AI content generation",
      "Unlimited post scheduling",
      "Up to 5 connected platforms",
      "Advanced AI rewriting",
      "Priority support",
    ],
  },
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    popular: false,
    features: [
      "Generate up to 20 AI captions",
      "Schedule 10 posts per month",
      "1 connected platform",
      "Basic AI support",
    ],
  },
];

const PricingSection: FC = () => (
  <motion.section
    id="pricing"
    className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
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
    <div className="max-w-6xl mx-auto text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
      <motion.h2
        variants={item}
        style={{ color: "hsl(var(--primary))", transition: "color 0.3s" }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 sm:mb-4 tracking-tight"
      >
        Pricing Plans
      </motion.h2>
      <motion.p
        variants={item}
        style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}
        className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
      >
        Choose the plan that fits your content workflow.
      </motion.p>
    </div>

    <motion.div
      variants={container}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
    >
      {plans.map((plan, idx) => (
        <motion.div
          key={idx}
          variants={item}
          whileHover={{ scale: 1.03 }}
          className={plan.popular ? "md:scale-105" : ""}
        >
          <Card
            className="h-full flex flex-col border"
            style={{
              borderColor: plan.popular ? "hsl(var(--primary))" : "hsl(var(--border))",
              boxShadow: plan.popular
                ? "0 10px 20px rgba(0,0,0,0.15)"
                : "0 2px 6px rgba(0,0,0,0.05)",
              transition: "all 0.3s",
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
            }}
          >
            <CardHeader className="text-center">
              <h3
                style={{ color: plan.popular ? "hsl(var(--primary))" : "hsl(var(--text-primary))", transition: "color 0.3s" }}
                className="text-2xl font-bold"
              >
                {plan.name}
              </h3>
              <p
                className="mt-2 text-4xl font-bold"
                style={{ color: "hsl(var(--text-primary))", transition: "color 0.3s" }}
              >
                {plan.price}
                <span
                  className="text-lg"
                  style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}
                >
                  {plan.period}
                </span>
              </p>
              {plan.popular && (
                <p style={{ color: "hsl(var(--primary))", transition: "color 0.3s" }} className="text-sm font-semibold mt-2">
                  Most Popular
                </p>
              )}
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center flex-row-reverse gap-2"
                    style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}
                  >
                    <Check className="h-5 w-5" style={{ color: "hsl(var(--primary))" }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto pt-4">
              <Button
                className="w-full py-3"
                style={{
                  backgroundColor: plan.popular ? "hsl(var(--primary))" : "hsl(var(--accent))",
                  color: plan.popular ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                  transition: "all 0.3s",
                }}
              >
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </motion.section>
);

export default PricingSection;
