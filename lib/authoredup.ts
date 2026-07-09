// ─── AuthoredUp (LinkedIn post performance + saved/competitor posts) ────────
// Docs: https://help.authoredup.com/api-docs/overview
// Get a key at: platform.authoredup.com/account/user → "Generate key"
// Set AUTHOREDUP_API_KEY in your .env.local
//
// Rate limit: 100 requests/hour, shared across all endpoints.

const BASE_URL = "https://api.authoredup.com/external/api/v1";

export type ActorType = "profile" | "company" | "group";

export interface AuthoredUpActor {
  identifier: string;
  type: ActorType;
  profile?: {
    id: string;
    first_name?: string;
    last_name?: string;
    occupation?: string;
    public_identifier?: string;
    follower_count?: number;
    connection_count?: number;
  };
  company?: {
    id: string;
    name?: string;
    url?: string;
    follower_count?: number;
  };
  [key: string]: unknown;
}

// The API returns more fields than this — these are the ones this hub relies on.
// See the full PostDataQueryResult schema at help.authoredup.com/api-docs/spec/json/v1
export interface AuthoredUpPost {
  urn: string;
  activity_urn: string | null;
  text: string | null;
  content_type: string;
  actor_profile_id?: string;
  actor_company_id?: string;
  post_published_at: string | null;
  reaction_count: number | null;
  comment_count: number | null;
  share_count: number | null;
  save_count: number | null;
  send_count: number | null;
  impression_count: number | null;
  engagement_rate: number | null; // (reactions + comments + shares) / impressions
  [key: string]: unknown;
}

export interface AuthoredUpPostQueryResult {
  items: AuthoredUpPost[];
  nextPageOffset: number | null;
}

interface AuthoredUpFetchOptions {
  method?: string;
  searchParams?: Record<string, string | number | string[] | undefined>;
}

async function authoredUpFetch<T>(path: string, options: AuthoredUpFetchOptions = {}): Promise<T> {
  const apiKey = process.env.AUTHOREDUP_API_KEY;
  if (!apiKey) throw new Error("AUTHOREDUP_API_KEY is not set in environment variables");

  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(options.searchParams ?? {})) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) url.searchParams.append(key, v);
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`AuthoredUp error ${response.status}: ${body.slice(0, 200)}`);
  }

  return response.json() as Promise<T>;
}

// ─── Own posts (post performance) ───────────────────────────────────────────

export interface GetOwnPostsOptions {
  actors?: string[];
  fromDate?: string; // ISO 8601
  toDate?: string; // ISO 8601
  limit?: number;
  sortField?: string; // defaults server-side to "post_updated_at"
  sortDirection?: "asc" | "desc";
}

export async function getOwnPosts(options: GetOwnPostsOptions = {}): Promise<AuthoredUpPostQueryResult> {
  return authoredUpFetch<AuthoredUpPostQueryResult>("/posts", {
    searchParams: {
      actors: options.actors,
      "from-date": options.fromDate,
      "to-date": options.toDate,
      limit: options.limit,
      "sort-field": options.sortField,
      "sort-direction": options.sortDirection,
    },
  });
}

// ─── Saved posts (competitor / tracked profile posts) ───────────────────────

export interface GetSavedPostsOptions {
  profiles?: string[]; // actor identifiers to filter saved posts by
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

export async function getSavedPosts(options: GetSavedPostsOptions = {}): Promise<AuthoredUpPostQueryResult> {
  return authoredUpFetch<AuthoredUpPostQueryResult>("/saved-posts", {
    searchParams: {
      actors: options.profiles,
      "from-date": options.fromDate,
      "to-date": options.toDate,
      limit: options.limit,
    },
  });
}

// ─── Actors (your profiles/companies + tracked profiles) ───────────────────

export async function getActors(includeTypes?: ActorType[]): Promise<AuthoredUpActor[]> {
  return authoredUpFetch<AuthoredUpActor[]>("/actors", {
    searchParams: { "include-types": includeTypes },
  });
}

// ─── Dashboard (follower/connection history for your own profile) ──────────

export interface DashboardHistoryPoint {
  follower_count: number | null;
  connection_count?: number;
  date: string;
  estimated?: boolean;
}

export async function getProfileHistory(
  profileId: string,
  period: "month" | "quarter" | "year" = "month"
): Promise<{ items: DashboardHistoryPoint[] }> {
  return authoredUpFetch(`/dashboard/${profileId}/profile-history`, {
    searchParams: { period },
  });
}
