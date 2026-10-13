"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do I add a new expense or income entry?",
    answer:
      "Click on 'Add Transaction' in the left menu or use the 'Quick Add' widget. Select Expense or Income, enter the merchant name and amount, choose a category and payment mode, and submit.",
  },
  {
    question: "How does the budget tracking work?",
    answer:
      "Your monthly budget is compared against all expenses recorded in the selected month. The dashboard and budget pages show utilization percentages and warn you if you exceed 80% or 100% of your target limit.",
  },
  {
    question: "Can I export my financial data?",
    answer:
      "Yes! You can export a CSV summary from the Reports page, or download a complete JSON backup of all transactions, categories, and settings from the Settings page.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Your data is persisted in your browser's session storage and automatically synchronized with the connected backend API endpoints.",
  },
  {
    question: "How do I create and track a savings goal?",
    answer:
      "Navigate to 'Goals' in the sidebar, click '+ New Goal', enter your target amount and target date, and use the quick deposit buttons to track your progress over time.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-transparent max-w-4xl w-full mx-auto">
      <div>
        <h1 className="text-heading2 lg:text-heading1 font-bold">Help & Support</h1>
        <p className="text-gray-600 text-body1">
          Find answers, learn tips, and get assistance with Expence Tracker
        </p>
      </div>

      {/* Quick Guide Banner */}
      <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-primary text-opposite rounded-xl flex-shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-heading3 font-bold text-primary">Getting Started</h2>
          <p className="text-body2 text-gray-700 mt-1">
            Expence Tracker helps you stay on top of personal finances with real-time balance calculations, category breakdowns, monthly cash-flow reports, and savings goals.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-background rounded-2xl p-6 border border-2 border-gray-200 shadow-md">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2 className="text-heading3 font-bold">Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left font-semibold text-body1 hover:text-primary transition-colors gap-4"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-body2 text-gray-600 mt-2 pl-1 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips & Keyboard Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background rounded-2xl p-6 border border-2 border-gray-200 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-heading3 font-bold">Financial Best Practices</h3>
          </div>
          <ul className="space-y-2 text-body2 text-gray-600 list-disc list-inside">
            <li>Log transactions immediately using the Quick Add card.</li>
            <li>Aim to save at least 20% of your net monthly income.</li>
            <li>Review your category breakdown monthly to spot spending leaks.</li>
            <li>Keep an Emergency Fund covering at least 3-6 months of expenses.</li>
          </ul>
        </div>

        <div className="bg-background rounded-2xl p-6 border border-2 border-gray-200 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="text-heading3 font-bold">Contact Support</h3>
          </div>
          <p className="text-body2 text-gray-600 mb-4">
            Need help with an issue or have a feature suggestion?
          </p>
          <div className="space-y-2 text-body2 font-medium">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-gray-400">Email:</span>
              <a href="mailto:support@expencetracker.com" className="text-primary hover:underline">
                support@expencetracker.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-gray-400">Status:</span>
              <span className="text-success font-semibold">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
