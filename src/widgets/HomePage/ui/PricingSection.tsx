"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Check } from "lucide-react";
import { container, item } from "@/shared/components/lib/animations";
import { FloatingIcons } from "@/shared/ui/floating-icons";

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
    mt-20
  "
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: false, amount: 0.2 }}
>

    <FloatingIcons/>
    {/* Title */}
    <div className="max-w-6xl mx-auto text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
      <motion.h2
        variants={item}
        className="
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
          font-extrabold 
          mb-2 sm:mb-4 
          tracking-tight
          transition-colors
        "
      >
        Pricing Plans
      </motion.h2>

      <motion.p
        // variants={item}
        className="
          text-[hsl(var(--text-secondary))]
          text-base sm:text-lg 
          max-w-2xl 
          mx-auto 
          leading-relaxed
          transition-colors
        "
      >
        Choose the plan that fits your content workflow.
      </motion.p>
    </div>

    {/* Plans Grid */}
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
            className={`
              h-full flex flex-col border transition-all duration-300
              bg-[hsl(var(--card))]
              text-[hsl(var(--card-foreground))]
              ${plan.popular 
                ? "border-[hsl(var(--primary))] shadow-xl" 
                : "border-[hsl(var(--border))] shadow-sm"
              }
            `}
          >
            <CardHeader className="text-center">
              <h3
                className={`
                  text-2xl font-bold transition-colors
                  ${plan.popular 
                    ? "text-[hsl(var(--primary))]" 
                    : "text-[hsl(var(--text-primary))]"
                  }
                `}
              >
                {plan.name}
              </h3>

              <p className="mt-2 text-4xl font-bold text-[hsl(var(--text-primary))] transition-colors">
                {plan.price}
                <span className="text-lg text-[hsl(var(--text-secondary))] transition-colors">
                  {plan.period}
                </span>
              </p>

              {plan.popular && (
                <p className="text-sm font-semibold mt-2 text-[hsl(var(--primary))] transition-colors">
                  Most Popular
                </p>
              )}
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="
                      flex items-center flex-row-reverse gap-2
                      text-[hsl(var(--text-secondary))]
                      transition-colors
                    "
                  >
                    <Check className="h-5 w-5 text-[hsl(var(--primary))]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto pt-4">
              <Button
                className={`
                  w-full py-3 transition-all
                  ${
                    plan.popular
                      ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                      : "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
                  }
                `}
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
