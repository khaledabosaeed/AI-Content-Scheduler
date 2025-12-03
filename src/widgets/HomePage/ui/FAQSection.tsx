"use client";
import { FC } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/components/ui/accordion';

const FAQSection: FC = () => (
  <section
    id="faq"
    className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 w-full"
    style={{
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      transition: "background-color 0.3s, color 0.3s",
    }}
  >
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
        <h3
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 tracking-tight"
          style={{ color: "hsl(var(--primary))", transition: "color 0.3s" }}
        >
          Frequently Asked Questions
        </h3>
        <p
          className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}
        >
          Quick answers to help you use AI Scheduler effectively.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="max-w-3xl mx-auto space-y-4"
      >
        <AccordionItem value="q1">
          <AccordionTrigger dir="ltr" style={{ color: "hsl(var(--text-primary))", transition: "color 0.3s" }}>
            How do I schedule my social media posts?
          </AccordionTrigger>
          <AccordionContent style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}>
            Simply connect your social media accounts, create your content, and select the desired posting time. Our AI will automatically post at the optimal time for engagement.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q2">
          <AccordionTrigger dir="ltr" style={{ color: "hsl(var(--text-primary))", transition: "color 0.3s" }}>
            Can I generate content automatically?
          </AccordionTrigger>
          <AccordionContent style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}>
            Yes! Use the AI Content feature to generate captions, hashtags, and post suggestions tailored to your audience.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q3">
          <AccordionTrigger dir="ltr" style={{ color: "hsl(var(--text-primary))", transition: "color 0.3s" }}>
            Which social media platforms can I connect?
          </AccordionTrigger>
          <AccordionContent style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}>
            Currently, you can connect Instagram, Twitter, Facebook, and LinkedIn. More platforms will be added over time.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q4">
          <AccordionTrigger dir="ltr" style={{ color: "hsl(var(--text-primary))", transition: "color 0.3s" }}>
            How does AI optimize my posting schedule?
          </AccordionTrigger>
          <AccordionContent style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}>
            Our AI analyzes your account's engagement patterns and suggests the best posting times to maximize reach and interaction.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q5">
          <AccordionTrigger dir="ltr" style={{ color: "hsl(var(--text-primary))", transition: "color 0.3s" }}>
            Can I track performance and analytics?
          </AccordionTrigger>
          <AccordionContent style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}>
            Absolutely! The Analytics dashboard shows detailed stats about your posts, engagement rate, and overall account growth.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q6">
          <AccordionTrigger dir="ltr" style={{ color: "hsl(var(--text-primary))", transition: "color 0.3s" }}>
            Is my account information safe?
          </AccordionTrigger>
          <AccordionContent style={{ color: "hsl(var(--text-secondary))", transition: "color 0.3s" }}>
            Yes, all your account credentials are securely encrypted, and we follow best practices to ensure your data is protected.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
