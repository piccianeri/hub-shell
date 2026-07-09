import { NextRequest, NextResponse } from "next/server";
import { getActors, type ActorType } from "@/lib/authoredup";

// Your own profiles/companies plus any profiles you're tracking in AuthoredUp.
// Use this to find the actor identifiers (e.g. LNP_abcdef) needed to filter
// /api/authoredup/posts and /api/authoredup/saved-posts.
// GET /api/authoredup/actors?include-types=profile&include-types=company
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeTypes = searchParams.getAll("include-types") as ActorType[];

  try {
    const actors = await getActors(includeTypes.length ? includeTypes : undefined);
    return NextResponse.json({ actors });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch AuthoredUp actors" },
      { status: 500 }
    );
  }
}
