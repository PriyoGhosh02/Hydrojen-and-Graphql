import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      question: 'What is TimeCrafts?',
      answer:
        'TimeCrafts is a premier luxury destination curating authentic, premium wristwatches, bespoke jewelry, and horological accessories from world-renowned makers.',
    },
    {
      question: 'Are the watches on TimeCrafts authentic?',
      answer:
        'Yes, 100% of our products are guaranteed authentic, brand-new, and sourced directly through authorized manufacturers or certified brand partners with stamped warranty cards and original packaging.',
    },
    {
      question: 'Do TimeCrafts offer a warranty on their products?',
      answer:
        'All timepieces include a comprehensive 2-Year International Manufacturer & Store Warranty covering mechanical movement defects and precision craftsmanship.',
    },
    {
      question: 'How fast is the shipping process and can I track my order?',
      answer:
        'Orders are dispatched within 24 hours via premium insured courier partners. You will receive real-time tracking information directly via email and SMS upon shipment.',
    },
    {
      question: 'What is your return and exchange policy?',
      answer:
        'We offer a seamless 7-day return and exchange policy for unworn items in their original packaging with all security tags intact. Simply contact our support team to arrange a free pickup.',
    },
    {
      question: 'Are Cash on Delivery (COD) and No-Cost EMI options available?',
      answer:
        'Yes, we support Cash on Delivery (COD) on eligible orders up to 25k, as well as zero-interest No-Cost EMI payment plans on orders above 7k across all major credit cards.',
    },
    {
      question: 'How do I redeem my 10% welcome discount code?',
      answer:
        'Enter code WELCOME10 in the promo code field during checkout to automatically receive 10% off your first purchase.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative z-10 w-full bg-white py-16 sm:py-24 border-t border-gray-100 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl text-center sm:text-3xl lg:text-4xl font-normal text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Minimalist FAQ List */}
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left cursor-pointer select-none focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-normal text-gray-900 tracking-tight pr-6 group-hover:text-black">
                    {faq.question}
                  </span>

                  {/* Clean + / - indicator */}
                  <span className="text-xl sm:text-2xl font-light text-gray-800 shrink-0 select-none">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {/* Answer Accordion */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed pt-1 pb-2">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
