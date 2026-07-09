import { NextRequest, NextResponse } from "next/server";
import { getOwnPosts } from "@/lib/authoredup";

// Your own LinkedIn post performance, via AuthoredUp.
// GET /api/authoredup/posts?limit=20&from-date=2026-01-01&actors=LNP_abcdef
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const result = await getOwnPosts({
      actors: searchParams.getAll("actors").length ? searchParams.getAll("actors") : undefined,
      fromDate: searchParams.get("from-date") ?? undefined,
      toDate: searchParams.get("to-date") ?? undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch AuthoredUp posts" },
      { status: 500 }
    );
  }
}
