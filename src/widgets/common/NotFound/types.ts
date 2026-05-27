import { WidgetProps } from "@/widgets/types";

export interface NotFoundSettings {
  variant?: string;
  errorCode?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export interface NotFoundData {
  // Static section -- no dynamic data
}

export type NotFoundProps = WidgetProps<NotFoundData, NotFoundSettings>;
