import Link from "next/link";
import { getIntelligenceAgents, type AgentState, type AgentStatus } from "@/lib/agent-state";
import { getMentors, formatMentorDate, type Mentor } from "@/lib/mentors";
import { fmtRelative } from "@/lib/fmt-date";

// ─── Hardcoded synthesis content — edit this block each week ─────────────────

const PILLARS = [
  {
    n: "01",
    name: "Accessibility as creative brief",
    desc: "Reframing constraints as design opportunities that unlock more human, more inventive solutions.",
  },
  {
    n: "02",
    name: "Practical implementation",
    desc: "Auditing, testing, and building accessible products with real tools and real workflows.",
  },
  {
    n: "03",
    name: "Organisational embedding",
    desc: "Getting accessibility into teams, procurement processes, and design systems that last.",
  },
  {
    n: "04",
    name: "The business case",
    desc: "Why accessible products win commercially, legally, and with the audiences that matter most.",
  },
];

const OPPORTUNITIES = [
  { rank: 1, title: "WCAG 2.2: what actually changed for designers", source: "SEO Researcher", pillar: "Pillar 02" },
  { rank: 2, title: "Why your accessibility audit found nothing useful", source: "Competitive Analyzer", pillar: "Pillar 01" },
  { rank: 3, title: "Accessible colour contrast beyond 4.5:1", source: "Content Researcher", pillar: "Pillar 02" },
];

const WHATS_WORKING = [
  { channel: "Newsletter", cls: "bg-primary/10 text-primary", note: "Open rates holding well above industry average" },
  { channel: "Website", cls: "bg-accent/10 text-accent", note: "Accessibility audit guide ranking in top 5" },
  { channel: "LinkedIn", cls: "bg-blue-50 text-blue-600", note: "Short posts driving DMs from in-house design teams" },
];

const KILL_LIST = [
  { title: "Long X threads", reason: "No traction. Wrong platform for this audience." },
  { title: "'10 tips' list posts", reason: "Converts poorly and attracts the wrong crowd." },
];

// ─── Agent → report route map ─────────────────────────────────────────────────

const AGENT_HREF: Record<string, string> = {
  content_researcher:      "/content/research",
  seo_aeo_researcher:      "/content/seo",
  competitive_analyzer:    "/content/competitive",
  content_gap_synthesizer: "/content/intelligence",
  substack_researcher:     "/content/newsletter",
  youtube_researcher:      "/content/youtube",
  offer_intel:             "/business/offers",
  technical_verifier:      "/content/verify",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function IntelligencePage() {
  const [agents, mentors] = await Promise.all([getIntelligenceAgents(), getMentors()]);

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-12">

      {/* 1. Header */}
      <div>
        <p className="text-xs text-muted mb-4">
          <Link href="/" className="hover:text-dark transition-colors">Dashboard</Link>
          <span className="mx-1.5">›</span>
          Intelligence
        </p>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl text-dark mb-2">Intelligence</h1>
            <p className="text-muted max-w-xl">
              Research synthesis across all agents. What's working, what's coming, what needs to die.
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span className="text-xs text-muted">Last synthesised 15 June 2026</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                Weekly review
              </span>
            </div>
          </div>
          <Link
            href="/agents"
            className="shrink-0 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Run new synthesis
          </Link>
        </div>
      </div>

      {/* 2. Synthesis block */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-light to-white p-8 space-y-8">

        {/* Pillars */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
            Content pillars this quarter
          </p>
          <h2 className="font-serif text-2xl text-dark mb-6">
            Four themes. Everything maps to one of these.
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {PILLARS.map((p) => (
              <div key={p.n} className="bg-white rounded-xl border border-border p-4">
                <p className="font-serif text-3xl text-primary/20 mb-2 leading-none">{p.n}</p>
                <p className="font-medium text-dark text-sm mb-1.5">{p.name}</p>
                <p className="text-xs text-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities + What's working */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
              Top opportunities this week
            </p>
            <div className="space-y-4">
              {OPPORTUNITIES.map((o) => (
                <div key={o.rank} className="flex gap-3 items-start">
                  <span className="font-serif text-2xl text-primary/30 w-7 shrink-0 leading-tight">{o.rank}</span>
                  <div>
                    <p className="text-sm font-medium text-dark">{o.title}</p>
                    <p className="text-xs text-muted mt-0.5">{o.source} · {o.pillar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
              What's working
            </p>
            <ul className="space-y-3">
              {WHATS_WORKING.map((w) => (
                <li key={w.channel} className="flex items-start gap-2.5">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${w.cls}`}>
                    {w.channel}
                  </span>
                  <span className="text-sm text-muted">{w.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kill list */}
        <div className="border-2 border-dashed border-primary/25 rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
            What needs to die
          </p>
          <div className="space-y-2.5">
            {KILL_LIST.map((k) => (
              <div key={k.title} className="flex items-start gap-3">
                <span className="text-primary font-bold text-base mt-0.5 shrink-0">×</span>
                <div>
                  <span className="text-sm font-medium text-dark">{k.title}</span>
                  <span className="text-xs text-muted ml-2">{k.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Research agents */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">
          The research layer
        </p>
        <h2 className="font-serif text-2xl text-dark mb-1">Agents that feed the synthesis</h2>
        <p className="text-sm text-muted mb-8">
          Click any agent to see its full report. Athena pulls from all of these on Monday mornings.
        </p>
        {agents.length === 0 ? (
          <div className="bg-white border border-border rounded-xl p-10 text-center">
            <p className="text-muted text-sm">
              No intelligence agents found. Run migration 005 in Supabase to seed them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Advisory layer */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">
          The advisory layer
        </p>
        <h2 className="font-serif text-2xl text-dark mb-8">
          Mentors that pressure-test your decisions
        </h2>
        {mentors.length === 0 ? (
          <div className="bg-white border border-border rounded-xl p-10 text-center">
            <p className="text-muted text-sm">
              No mentors yet. Add rows to the mentors table to build your advisory board.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </div>

      {/* 5. Next run banner */}
      <div className="bg-dark rounded-2xl p-6 flex items-center justify-between gap-6">
        <p className="text-white/70 text-sm">
          Next weekly synthesis:{" "}
          <span className="text-white font-medium">Monday 22 June 2026 at 07:00.</span>{" "}
          Athena will re-run all agents and refresh this page.
        </p>
        <Link
          href="/agents"
          className="shrink-0 text-sm text-white border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          Run now instead →
        </Link>
      </div>

    </div>
  );
}

// ─── Agent card ───────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: AgentState }) {
  const href = AGENT_HREF[agent.role] ?? "/agents";
  return (
    <div className="bg-white border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-dark text-sm">
            {agent.name}
            {agent.role_display && (
              <span className="font-normal text-muted italic ml-1.5">({agent.role_display})</span>
            )}
          </p>
          {agent.description && (
            <p className="text-xs text-muted mt-1 leading-relaxed">{agent.description}</p>
          )}
        </div>
        <FreshnessBadge status={agent.freshness} />
      </div>

      <div className="border-l-2 border-primary pl-3 py-0.5 min-h-[2rem] flex items-center">
        {agent.lastTitle ? (
          <p className="text-xs text-dark">{agent.lastTitle}</p>
        ) : (
          <p className="text-xs text-muted italic">No reports yet</p>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted pt-1 border-t border-border">
        <span>
          {agent.lastRun ? `Last run ${fmtRelative(agent.lastRun)}` : "Never run"}
          {" · "}
          {agent.outputCount} output{agent.outputCount !== 1 ? "s" : ""}
        </span>
        <Link href={href} className="text-primary hover:underline">
          View full report →
        </Link>
      </div>
    </div>
  );
}

// ─── Mentor card ──────────────────────────────────────────────────────────────

const MENTOR_STATUS: Record<string, { label: string; cls: string }> = {
  active:     { label: "Active",     cls: "bg-accent/10 text-accent" },
  extracted:  { label: "Building",   cls: "bg-gold/10 text-gold" },
  collecting: { label: "Collecting", cls: "bg-muted/10 text-muted" },
};

function MentorCard({ mentor }: { mentor: Mentor }) {
  const badge = MENTOR_STATUS[mentor.status] ?? MENTOR_STATUS.collecting;
  const snippet = mentor.worldview
    ? mentor.worldview.slice(0, 150) + (mentor.worldview.length > 150 ? "…" : "")
    : null;

  return (
    <div className="bg-white border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-dark text-sm">
            {mentor.name}
            <span className="font-normal text-muted italic ml-1.5">({mentor.agent_name})</span>
          </p>
          <p className="text-xs text-muted mt-0.5">{mentor.domain}</p>
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted">
        <span>{mentor.source_count} source{mentor.source_count !== 1 ? "s" : ""}</span>
        <span>{mentor.batches_complete}/{mentor.batch_total} batches complete</span>
      </div>

      <div className="border-l-2 border-primary pl-3 py-0.5 min-h-[2rem] flex items-center">
        {snippet ? (
          <p className="text-xs text-dark">{snippet}</p>
        ) : (
          <p className="text-xs text-muted italic">Worldview not yet extracted — add sources to begin.</p>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted pt-1 border-t border-border">
        <span>
          Refreshed {formatMentorDate(mentor.last_updated)} · {mentor.refresh_cadence}
        </span>
        <Link href={`/intelligence/mentors/${mentor.slug}`} className="text-primary hover:underline">
          View profile →
        </Link>
      </div>
    </div>
  );
}

// ─── Freshness badge ──────────────────────────────────────────────────────────

const FRESHNESS: Record<AgentStatus, { label: string; cls: string }> = {
  fresh:   { label: "Fresh",   cls: "bg-accent/10 text-accent" },
  stale:   { label: "Stale",   cls: "bg-gold/10 text-gold" },
  idle:    { label: "Idle",    cls: "bg-muted/10 text-muted" },
  planned: { label: "Planned", cls: "bg-primary/10 text-primary" },
};

function FreshnessBadge({ status }: { status: AgentStatus }) {
  const { label, cls } = FRESHNESS[status];
  return (
    <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${cls}`}>
      {label}
    </span>
  );
}
