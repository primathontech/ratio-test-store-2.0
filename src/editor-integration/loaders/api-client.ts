import { osMerchantHeaders } from "@/utils/os-headers";

export interface TemplateApiResponse {
  data: {
    template: {
      pageConfig: any;
      metadata: {
        id: string;
        name: string;
        brand: string;
        type: string;
        version: string;
        routeContext: {
          type: string;
          path: string;
          params: Record<string, any>;
          query: Record<string, any>;
        };
      };
      version: string;
      modifiedBy: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

/** The editor has no template with this id (404), as opposed to being unreachable. */
export class TemplateNotFoundError extends Error {
  constructor(templateId: string) {
    super(`Template ${templateId} not found in the editor`);
    this.name = "TemplateNotFoundError";
  }
}

export class TemplateApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_EDITOR_API_URL ||
      "https://api-gw-v4.dev.gokwik.in/uat/os-editor";
  }

  /**
   * Fetch template configuration from the API
   */
  async fetchTemplate(
    merchantName: string,
    templateId: string
  ): Promise<TemplateApiResponse> {
    const url = `${this.baseUrl}/api/v1/themes/${merchantName}/templates/${templateId}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000); // 10 second timeout

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...osMerchantHeaders() },
        signal: controller.signal,
        // Full ISR: tagged + time-revalidated so the template is cacheable and
        // always sourced from the backend (no filesystem fallback). Tag must
        // match the revalidate webhook (single-merchant → no theme prefix).
        next: {
          tags: [`editor-template:${templateId}`],
          revalidate: 3600,
        },
      });

      clearTimeout(timeoutId);

      if (response.status === 404) {
        throw new TemplateNotFoundError(templateId);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as TemplateApiResponse;
    } catch (error) {
      if (error instanceof TemplateNotFoundError) {
        throw error;
      }
      console.error(`Error fetching template from ${url}:`, error);
      throw new Error(
        `Failed to fetch template: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Check if the API is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 5000); // 5 second timeout

      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return response.ok;
    } catch (error) {
      console.warn("Template API is not available:", error);
      return false;
    }
  }
}

// Create a singleton instance
export const templateApiClient = new TemplateApiClient();
