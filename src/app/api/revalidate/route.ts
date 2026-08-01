import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation endpoint for TPI/Visual Editor dashboard changes.
 *
 * When template data is updated on the dashboard, call this endpoint
 * to immediately invalidate ISR-cached pages so the next request
 * fetches fresh TPI data.
 *
 * Usage:
 *   POST /api/revalidate
 *   Headers: { "x-revalidation-secret": "<REVALIDATION_SECRET>" }
 *   Body: { "path": "/products/some-handle" }
 *     or: { "paths": ["/", "/collections/all"] }
 *     or: {} (revalidates all TPI-dependent pages)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret
    const secret = request.headers.get("x-revalidation-secret");
    if (
      process.env.REVALIDATION_SECRET &&
      secret !== process.env.REVALIDATION_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const revalidated: string[] = [];

    if (body.path) {
      // Revalidate a single path
      revalidatePath(body.path);
      revalidated.push(body.path);
    } else if (body.paths && Array.isArray(body.paths)) {
      // Revalidate multiple specific paths
      for (const p of body.paths) {
        revalidatePath(p);
        revalidated.push(p);
      }
    } else {
      // Revalidate all TPI-dependent pages
      revalidatePath("/", "layout");
      revalidated.push("/ (full site layout)");
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
