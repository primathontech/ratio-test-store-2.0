import type { WidgetBoundary as WidgetBoundaryComponent } from "@shopkit/builder";
import { ObservabilityBoundary } from "@shopkit/observability/react";

/**
 * Wrapped around every page widget by the page builder: a widget that crashes
 * renders nothing, the rest of the page stays up, and the crash is reported with
 * the widget's id and type.
 */
export const WidgetBoundary: WidgetBoundaryComponent = ({
  widgetId,
  widgetType,
  children,
}) => (
  <ObservabilityBoundary kind="widget" id={widgetId} type={widgetType}>
    {children}
  </ObservabilityBoundary>
);
