import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Admin-panel "Analytics" block — READ-ONLY. Mirrors convex/settings.ts auth
// guard (getAuthUserId -> throw if not signed in). No mutations: analytics is
// read-only by nature. KPIs + the 30-day series are computed from REAL
// konsultan tables (konsultanClients, subscribers, konsultanProjects,
// konsultanInvoices, konsultanContactSubmissions, konsultanKbArticles) via
// _creationTime. sources / topPages / funnel are illustrative — there is no
// event-tracking infra in this template, so those keep the demo's seed shape.
// See the // ponytail: comments below.

const DAY_MS = 86_400_000;
const WINDOW_DAYS = 30;

// Donut palette + funnel/page labels — kept here so the query returns the same
// shape the bindings expect. Counts that we CAN derive cheaply use real data.
const SOURCE_PALETTE = [
  { id: "direct", label: "Direct", color: "#a78bfa" },
  { id: "search", label: "Organic search", color: "#34d399" },
  { id: "referral", label: "Referral", color: "#fbbf24" },
  { id: "social", label: "Social", color: "#60a5fa" },
  { id: "email", label: "Email", color: "#f87171" },
] as const;

function pct(curr: number, prev: number): number {
  if (prev === 0) return curr === 0 ? 0 : 100;
  return ((curr - prev) / prev) * 100;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");

    const now = Date.now();
    const windowStart = now - WINDOW_DAYS * DAY_MS;
    const prevStart = now - 2 * WINDOW_DAYS * DAY_MS;

    // Pull every row's _creationTime from the real content tables. These tables
    // are small (admin-managed content), so a full collect is fine.
    const [clients, subscribers, projects, invoices, submissions, articles] =
      await Promise.all([
        ctx.db.query("konsultanClients").collect(),
        ctx.db.query("subscribers").collect(),
        ctx.db.query("konsultanProjects").collect(),
        ctx.db.query("konsultanInvoices").collect(),
        ctx.db.query("konsultanContactSubmissions").collect(),
        ctx.db.query("konsultanKbArticles").collect(),
      ]);

    // --- KPI cards (REAL counts, deltas vs the previous 30-day window) ---
    const inWindow = <T extends { _creationTime: number }>(rows: T[], from: number, to: number) =>
      rows.filter((r) => r._creationTime >= from && r._creationTime < to).length;

    const clientsCurr = inWindow(clients, windowStart, now);
    const clientsPrev = inWindow(clients, prevStart, windowStart);
    const subsCurr = inWindow(subscribers, windowStart, now);
    const subsPrev = inWindow(subscribers, prevStart, windowStart);
    const projectsCurr = inWindow(projects, windowStart, now);
    const projectsPrev = inWindow(projects, prevStart, windowStart);
    const submCurr = inWindow(submissions, windowStart, now);
    const submPrev = inWindow(submissions, prevStart, windowStart);

    // invoices is collected so its _creationTime stays available for future
    // KPI swaps; touch it here to keep the value meaningful in the activity mix.
    const kpis = [
      {
        id: "clients",
        label: "Clients",
        value: clients.length.toLocaleString(),
        deltaPct: Number(pct(clientsCurr, clientsPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "leads",
        label: "Contact leads",
        value: submissions.length.toLocaleString(),
        deltaPct: Number(pct(submCurr, submPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "subscribers",
        label: "Subscribers",
        value: subscribers.length.toLocaleString(),
        deltaPct: Number(pct(subsCurr, subsPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "projects",
        label: "Projects",
        value: projects.length.toLocaleString(),
        deltaPct: Number(pct(projectsCurr, projectsPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
    ];

    // --- 30-day series (REAL): per-day new activity + new sessions proxy ---
    // views = clients+subscribers+projects+invoices+submissions+articles created
    // that day (a real activity signal), sessions = clients+subscribers+
    // submissions that day.
    const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10);
    const viewsByDay = new Map<string, number>();
    const sessByDay = new Map<string, number>();
    const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
    for (const r of [...clients, ...subscribers, ...projects, ...invoices, ...submissions, ...articles]) {
      if (r._creationTime < windowStart) continue;
      bump(viewsByDay, dayKey(r._creationTime));
    }
    for (const r of [...clients, ...subscribers, ...submissions]) {
      if (r._creationTime < windowStart) continue;
      bump(sessByDay, dayKey(r._creationTime));
    }
    const series = Array.from({ length: WINDOW_DAYS }, (_, i) => {
      const d = dayKey(windowStart + (i + 1) * DAY_MS);
      return { date: d, views: viewsByDay.get(d) ?? 0, sessions: sessByDay.get(d) ?? 0 };
    });

    // --- Traffic sources (REAL labels mapped from subscriber `source`) ---
    // We DO have a `source` string on subscribers, so the donut is real:
    // bucket each into the known palette ids (fallback -> "direct").
    const knownIds = new Set<string>(SOURCE_PALETTE.map((s) => s.id));
    const visitsById = new Map<string, number>();
    for (const r of subscribers) {
      const key = knownIds.has(r.source) ? r.source : "direct";
      visitsById.set(key, (visitsById.get(key) ?? 0) + 1);
    }
    const sources = SOURCE_PALETTE.map((s) => ({
      id: s.id,
      label: s.label,
      color: s.color,
      visits: visitsById.get(s.id) ?? 0,
    }));

    // --- Top pages: REAL set (published KB articles), illustrative metrics. ---
    // ponytail: illustrative — no event-tracking infra to count real article
    // views; views/duration/bounce derived deterministically from body length
    // so the table isn't empty.
    const topPages = [...articles]
      .filter((a) => a.status === "published")
      .sort((a, b) => b.body.length - a.body.length)
      .slice(0, 6)
      .map((a) => ({
        path: `/kb/${a.slug}`,
        title: a.title,
        views: Math.max(50, Math.round(a.body.length / 8)),
        avgDurationSec: Math.max(30, Math.round(a.body.length / 12)),
        bounceRate: 0.35,
      }));

    // --- Conversion funnel ---
    // ponytail: illustrative — no event-tracking infra to measure scroll/CTA
    // steps. Anchored on REAL endpoints: top = subscribers proxy for visits,
    // bottom = real contact-submission count; the two middle steps are
    // interpolated drop-offs.
    const submits = submissions.length;
    const visits = Math.max(subscribers.length * 8, submits * 4, 1);
    const funnel = [
      { id: "visit", label: "Landing visit", count: visits },
      { id: "scroll", label: "Scrolled past hero", count: Math.round(visits * 0.71) },
      { id: "cta-view", label: "Saw primary CTA", count: Math.round(visits * 0.41) },
      { id: "cta-click", label: "Clicked CTA", count: Math.round(Math.max(submits * 3, visits * 0.11)) },
      { id: "form-submit", label: "Form submit", count: submits },
    ];

    return { kpis, series, sources, topPages, funnel };
  },
});
