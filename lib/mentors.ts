import { createServerClient } from "@/lib/supabase-server";

export type Mentor = {
  id: string;
  slug: string;
  name: string;
  agent_name: string;
  domain: string;
  status: "active" | "extracted" | "collecting";
  source_count: number;
  batches_complete: number;
  batch_total: number;
  worldview: string | null;
  refresh_cadence: string;
  last_updated: string | null;
  created_at: string;
};

export const MENTOR_BATCH_TOTAL = 3;

export async function getMentors(): Promise<Mentor[]> {
  const supabase = createServerClient();
  const { data } = await supabase.from("mentors").select("*").order("created_at");
  return (data as Mentor[]) ?? [];
}

export function formatMentorDate(iso: string | null): string {
  if (!iso) return "Not yet refreshed";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
