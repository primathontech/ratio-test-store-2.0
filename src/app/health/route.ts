import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      {
        success: false,
        error: { message: errorMessage },
      },
      { status: 500 }
    );
  }
}
