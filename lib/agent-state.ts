import { createServerClient } from "@/lib/supabase-server";

export type AgentStatus = "fresh" | "stale" | "idle" | "planned";

export type AgentState = {
  id: string;
  name: string;
  role: string;
  role_display: string | null;
  description: string | null;
  agent_status: string;
  lastRun: string | null;
  lastTitle: string | null;
  outputCount: number;
  freshness: AgentStatus;
};

const FRESH_MS = 72 * 60 * 60 * 1000;

export async function getIntelligenceAgents(): Promise<AgentState[]> {
  const supabase = createServerClient();

  const { data: agents, error } = await supabase
    .from("pantheon_agents")
    .select("id, name, role, role_display, description, agent_status")
    .eq("division", "intelligence")
    .order("created_at");

  if (error || !agents?.length) return [];

  const agentIds = agents.map((a) => a.id);

  const { data: allOutputs } = await supabase
    .from("agent_outputs")
    .select("id, agent_id, title, created_at")
    .in("agent_id", agentIds)
    .order("created_at", { ascending: false });

  const latestByAgent = new Map<string, { title: string | null; created_at: string }>();
  const countByAgent = new Map<string, number>();

  for (const o of allOutputs ?? []) {
    if (!latestByAgent.has(o.agent_id)) {
      latestByAgent.set(o.agent_id, { title: o.title, created_at: o.created_at });
    }
    countByAgent.set(o.agent_id, (countByAgent.get(o.agent_id) ?? 0) + 1);
  }

  return agents.map((agent) => {
    const latest = latestByAgent.get(agent.id) ?? null;
    const outputCount = countByAgent.get(agent.id) ?? 0;

    let freshness: AgentStatus = "idle";
    if (agent.agent_status === "planned") {
      freshness = "planned";
    } else if (latest) {
      const age = Date.now() - new Date(latest.created_at).getTime();
      freshness = age < FRESH_MS ? "fresh" : "stale";
    }

    return {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      role_display: agent.role_display ?? null,
      description: agent.description ?? null,
      agent_status: agent.agent_status ?? "active",
      lastRun: latest?.created_at ?? null,
      lastTitle: latest?.title ?? null,
      outputCount,
      freshness,
    };
  });
}
