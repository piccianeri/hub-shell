import { NextRequest, NextResponse } from "next/server";
import { getSavedPosts } from "@/lib/authoredup";

// Posts you've saved in AuthoredUp — e.g. tracked competitor posts.
// GET /api/authoredup/saved-posts?profiles=LNP_abcdef&limit=20
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const result = await getSavedPosts({
      profiles: searchParams.getAll("profiles").length ? searchParams.getAll("profiles") : undefined,
      fromDate: searchParams.get("from-date") ?? undefined,
      toDate: searchParams.get("to-date") ?? undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch AuthoredUp saved posts" },
      { status: 500 }
    );
  }
}
