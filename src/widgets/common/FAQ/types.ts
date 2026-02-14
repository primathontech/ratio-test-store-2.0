/**
 * FAQ types
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQSettings {
  title?: string;
  showCategories?: boolean;
  expandMultiple?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export interface FAQProps {
  items: FAQItem[];
  settings?: FAQSettings;
}

export default {
  FAQItem: {} as FAQItem,
  FAQSettings: {} as FAQSettings,
  FAQProps: {} as FAQProps,
};
