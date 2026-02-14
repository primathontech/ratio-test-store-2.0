/**
 * Facebook CAPI Configuration interface
 */
interface FacebookCAPIConfig {
  pixelId: string;
  accessToken: string;
  baseUrl: string;
  testEventCode?: string;
}

/**
 * Validate and get Facebook CAPI configuration from environment variables
 */
function getFacebookCAPIConfig(): {
  config: FacebookCAPIConfig | null;
  error: string | null;
} {
  const pixelId = process.env.NEXT_PUBLIC_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;
  const baseUrl =
    process.env.FACEBOOK_CAPI_BASE_URL || "https://graph.facebook.com/v21.0";
  const testEventCode = process.env.FACEBOOK_TEST_EVENT_CODE;

  // Check for required environment variables
  const missingVars: string[] = [];
  if (!pixelId) missingVars.push("NEXT_PUBLIC_PIXEL_ID");
  if (!accessToken) missingVars.push("FACEBOOK_CAPI_ACCESS_TOKEN");

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(", ")}. Please add these to your .env file.`;
    console.error("Facebook CAPI Configuration Error:", errorMessage);
    return { config: null, error: errorMessage };
  }

  return {
    config: {
      pixelId: pixelId!,
      accessToken: accessToken!,
      baseUrl,
      testEventCode,
    },
    error: null,
  };
}

/**
 * Get client IP address from request headers
 */
function getClientIpAddress(request: Request): string | undefined {
  // Try different headers for IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  return forwarded?.split(",")[0] || realIp || cfConnectingIp || undefined;
}

/**
 * Convert to Facebook CAPI format using enhancedParams (same as client-side)
 */
function convertToFacebookCAPIEvent(
  eventName: string,
  eventId: string,
  timestamp: number | undefined,
  enhancedParams: any,
  userInfo: any
) {
  // Facebook CAPI expects Unix timestamp (seconds since epoch)
  // JavaScript timestamps are in milliseconds, so we divide by 1000
  // Note: Client-side window.fbq handles this conversion automatically
  const eventTime = timestamp
    ? Math.floor(timestamp / 1000)
    : Math.floor(Date.now() / 1000);

  return {
    event_name: eventName,
    event_time: eventTime,
    event_id: eventId,
    action_source: "website",
    user_data: {
      client_ip_address: userInfo?.clientIpAddress,
      client_user_agent: userInfo?.clientUserAgent,
      fbc: userInfo?.fbc,
      fbp: userInfo?.fbp,
    },
    custom_data: enhancedParams, // Use the same enhancedParams as client-side
  };
}

/**
 * Send event to Facebook CAPI
 */
async function sendToFacebookCAPI(
  config: FacebookCAPIConfig,
  capiEvent: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const payload = {
      data: [capiEvent],
      test_event_code: config.testEventCode,
    };

    const url = `${config.baseUrl}/${config.pixelId}/events?access_token=${config.accessToken}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Facebook CAPI Error:", errorData);
      return {
        success: false,
        error: `Facebook CAPI request failed: ${response.status} - ${JSON.stringify(errorData)}`,
      };
    }

    const result = await response.json();
    console.log("Facebook CAPI: Events sent successfully", {
      events_received: result.events_received,
      messages: result.messages,
    });

    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Facebook CAPI Network Error:", errorMessage);
    return { success: false, error: `Network error: ${errorMessage}` };
  }
}

export async function POST(request: Request) {
  try {
    // Validate Facebook CAPI configuration
    const { config, error: configError } = getFacebookCAPIConfig();
    if (!config) {
      return Response.json(
        {
          error: "Facebook CAPI configuration error",
          details: configError,
          hint: "Please check your environment variables in .env file",
        },
        { status: 500 }
      );
    }

    // Parse and validate request data
    const { eventName, eventId, timestamp, enhancedParams, userInfo } =
      await request.json();

    if (!eventName || !enhancedParams) {
      return Response.json(
        {
          error: "Invalid event data",
          details: "eventName and enhancedParams are required",
          received: {
            eventName: !!eventName,
            enhancedParams: !!enhancedParams,
          },
        },
        { status: 400 }
      );
    }

    // Enhance user info with server-side data
    const enhancedUserInfo = {
      ...userInfo,
      clientIpAddress: getClientIpAddress(request),
    };

    // Convert to Facebook CAPI format
    const capiEvent = convertToFacebookCAPIEvent(
      eventName,
      eventId,
      timestamp,
      enhancedParams,
      enhancedUserInfo
    );

    // Send to Facebook CAPI
    const result = await sendToFacebookCAPI(config, capiEvent);

    if (!result.success) {
      return Response.json(
        {
          error: "Failed to send event to Facebook CAPI",
          details: result.error,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Successfully sent event to Facebook CAPI",
      events_received: result.data?.events_received,
      facebook_response: result.data?.messages,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("API Events Error:", errorMessage);

    return Response.json(
      {
        error: "Failed to process events",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
