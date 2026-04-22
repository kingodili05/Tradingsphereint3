'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What assets can I trade on TradingSphereIntl?',
    answer: 'You can trade a wide variety of assets including cryptocurrencies, forex pairs, ETFs, stocks, and commodities. We offer over 150 different instruments across global markets.',
  },
  {
    question: 'Is my money safe with TradingSphereIntl?',
    answer: 'Yes, we use bank-grade security measures including SSL encryption, two-factor authentication, and cold storage for crypto assets. We are also regulated and insured.',
  },
  {
    question: 'What is the minimum deposit?',
    answer: 'You can start trading with as little as $100. However, we recommend starting with at least $500 to have better risk management options.',
  },
  {
    question: 'Do you offer a demo account?',
    answer: 'Yes, all new users get access to a demo account with $10,000 in virtual funds to practice trading without any risk.',
  },
  {
    question: 'What are the trading fees?',
    answer: 'Our fees are competitive and transparent. Crypto trades start from 0.1%, forex spreads from 0.5 pips, and stock trades from $2.99 per trade.',
  },
  {
    question: 'Can I access the platform on mobile?',
    answer: 'Yes, our platform is fully responsive and works perfectly on desktop, tablet, and mobile devices. We also have dedicated mobile apps coming soon.',
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about our platform and services.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}