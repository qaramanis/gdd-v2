"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I get started with open source?",
      answer:
        "Simply sign up, browse projects that interest you, and start contributing. We provide guides and mentorship for beginners.",
    },
    {
      question: "Is the platform really free?",
      answer:
        "Yes, our core features are completely free for open source projects. We offer premium features for enterprise teams.",
    },
    {
      question: "How does project discovery work?",
      answer:
        "Our AI-powered algorithm matches developers with projects based on their skills, interests, and contribution history.",
    },
    {
      question: "Can I migrate my existing project?",
      answer:
        "Absolutely! We support seamless migration from GitHub, GitLab, and Bitbucket with all history preserved.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 px-4 bg-gradient-to-b from-black to-violet-950/10"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know to get started
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/[0.02] transition-all"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-white">{faq.question}</span>
                <ChevronRight
                  className={`h-5 w-5 text-gray-400 transition-transform ${openIndex === index ? "rotate-90" : ""}`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
