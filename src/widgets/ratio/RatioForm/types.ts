import { WidgetProps } from "@/widgets/types";

export interface RatioFormSettings {
  formId?: string;
  variant?: string;
}

export type RatioFormProps = WidgetProps<unknown, RatioFormSettings>;
