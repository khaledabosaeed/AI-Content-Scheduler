"use client";
import { FC } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}from '@/components/ui/accordion';

const FAQSection: FC = () => (
  <section id="faq" className="py-20 px-6 bg-gray-50">
    <div className="max-w-6xl mx-auto text-center mb-8">
      <h3 className="text-3xl font-bold mb-3">Frequently Asked Questions</h3>
      <p className="text-gray-600">Quick answers for common questions.</p>
    </div>
    <Accordion
      type="single"
      collapsible
      className="max-w-3xl mx-auto space-y-4"
    >
      <AccordionItem value="q1">
        <AccordionTrigger dir="ltr">How does AI scheduling work?</AccordionTrigger>
        <AccordionContent>
          Our AI analyzes performance patterns and suggests optimal posting
          times and content improvements.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger dir="ltr">Can I integrate multiple accounts?</AccordionTrigger>
        <AccordionContent>
          Yes — connect multiple accounts and manage them from one dashboard.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q3">
        <AccordionTrigger dir="ltr">Do you support analytics?</AccordionTrigger>
        <AccordionContent>
          Absolutely — the Analytics dashboard shows engagement, growth and
          recommendations.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
);

export default FAQSection;
