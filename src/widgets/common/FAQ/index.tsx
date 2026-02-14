"use client";

import React, { useState } from "react";
import { FAQItem, FAQSettings, FAQProps } from "./types";

/**
 * FAQ Component
 */
export function FAQ({ items, settings = {} }: FAQProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!settings.expandMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={`faq-container ${settings.className || ""}`}>
      {settings.title && (
        <h2 className="text-2xl font-bold mb-6">{settings.title}</h2>
      )}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full p-4 text-left flex justify-between items-center"
            >
              <span className="font-medium">{item.question}</span>
              <span className="text-xl">
                {expandedItems.has(item.id) ? "−" : "+"}
              </span>
            </button>
            {expandedItems.has(item.id) && (
              <div className="p-4 pt-0 text-gray-600">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
export type { FAQItem, FAQSettings, FAQProps };
