"use client";
import { FC } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/components/ui/accordion';
import { FloatingIcons } from "@/shared/ui/floating-icons";

const FAQSection: FC = () => (
  <section
    id="faq"
    className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-colors pt-20"
  >
    <FloatingIcons/>
    <div className="max-w-6xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 tracking-tight text-[hsl(var(--text-primary))]  transition-colors">
          Frequently Asked Questions
        </h3>
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-text-secondary transition-colors">
          Quick answers to help you use AI Scheduler effectively.
        </p>
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
        <AccordionItem value="q1">
          <AccordionTrigger dir="ltr" className="text-text-primary transition-colors">
            How do I schedule my social media posts?
          </AccordionTrigger>
          <AccordionContent className="text-text-secondary transition-colors">
            Simply connect your social media accounts, create your content, and select the desired posting time. Our AI will automatically post at the optimal time for engagement.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q2">
          <AccordionTrigger dir="ltr" className="text-text-primary transition-colors">
            Can I generate content automatically?
          </AccordionTrigger>
          <AccordionContent className="text-text-secondary transition-colors">
            Yes! Use the AI Content feature to generate captions, hashtags, and post suggestions tailored to your audience.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q3">
          <AccordionTrigger dir="ltr" className="text-text-primary transition-colors">
            Which social media platforms can I connect?
          </AccordionTrigger>
          <AccordionContent className="text-text-secondary transition-colors">
            Currently, you can connect Instagram, Twitter, Facebook, and LinkedIn. More platforms will be added over time.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q4">
          <AccordionTrigger dir="ltr" className="text-text-primary transition-colors">
            How does AI optimize my posting schedule?
          </AccordionTrigger>
          <AccordionContent className="text-text-secondary transition-colors">
            Our AI analyzes your account's engagement patterns and suggests the best posting times to maximize reach and interaction.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q5">
          <AccordionTrigger dir="ltr" className="text-text-primary transition-colors">
            Can I track performance and analytics?
          </AccordionTrigger>
          <AccordionContent className="text-text-secondary transition-colors">
            Absolutely! The Analytics dashboard shows detailed stats about your posts, engagement rate, and overall account growth.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q6">
          <AccordionTrigger dir="ltr" className="text-text-primary transition-colors">
            Is my account information safe?
          </AccordionTrigger>
          <AccordionContent className="text-text-secondary transition-colors">
            Yes, all your account credentials are securely encrypted, and we follow best practices to ensure your data is protected.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
