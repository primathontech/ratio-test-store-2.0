import React from "react";
import { ITestimonial } from "../../types";
import {
  TestimonialCardVariant,
  CardStyleConfig,
  CardVariantComponent,
} from "./types";
import { DefaultCard } from "./DefaultCard";
import { BbluntTestimonialCard } from "./BbluntTestimonialCard";
import { TheDermaTestimonialCard } from "./TheDermaTestimonialCard";
import { AquaLogicaTestimonialCard } from "./AquaLogicaTestimonialCard";

/**
 * Props for the TestimonialCardWrapper component
 */
export interface TestimonialCardWrapperProps {
  /** The testimonial data to display */
  testimonial: ITestimonial;

  /** Card variant to use */
  variant?: TestimonialCardVariant;

  /** Style configuration for the card */
  styleConfig?: CardStyleConfig;

  /** Legacy backgroundColor prop for backward compatibility */
  backgroundColor?: string;
}

/**
 * TestimonialCardWrapper - A flexible wrapper that allows merchants to customize testimonial cards
 *
 * This component provides multiple pre-built card variants and supports custom card components.
 * Merchants can easily switch between different card styles by changing the variant prop.
 *
 * @example
 * // Using default variant
 * <TestimonialCardWrapper
 *   testimonial={testimonial}
 *   variant="default"
 * />
 *
 * @example
 * // Using minimal variant with custom styling
 * <TestimonialCardWrapper
 *   testimonial={testimonial}
 *   variant="minimal"
 *   styleConfig={{
 *     backgroundColor: "#f9fafb",
 *     textColors: { name: "#1f2937" }
 *   }}
 * />
 *
 * @example
 * // Using custom card component
 * <TestimonialCardWrapper
 *   testimonial={testimonial}
 *   variant="custom"
 *   CustomCardComponent={MyCustomCard}
 * />
 */
export const TestimonialCardWrapper: React.FC<TestimonialCardWrapperProps> = ({
  testimonial,
  variant = "default",
  styleConfig = {},
  backgroundColor,
}) => {
  // Merge backgroundColor prop into styleConfig for backward compatibility
  const mergedStyleConfig: CardStyleConfig = {
    ...styleConfig,
    backgroundColor: styleConfig.backgroundColor || backgroundColor,
  };

  // Select the appropriate card component based on variant
  const getCardComponent = (): CardVariantComponent => {
    switch (variant) {
      case "bblunt":
        return BbluntTestimonialCard;
      case "thederma":
        return TheDermaTestimonialCard;
      case "aqualogica":
        return AquaLogicaTestimonialCard;
      case "default":
      default:
        return DefaultCard;
    }
  };

  const CardComponent = getCardComponent();

  return (
    <div data-testid={`testimonial-card-wrapper-${testimonial.id}`}>
      <CardComponent
        testimonial={testimonial}
        styleConfig={mergedStyleConfig}
      />
    </div>
  );
};
