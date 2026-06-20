import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { commentsTables } from "./features/comments/_schema";
import { notionTables } from "./features/notion/_schema";

// Konsultan OS — full schema (Convex target).
// authTables = @convex-dev/auth. Content tables mirror the localStorage shape
// the frontend store used (shared/types.ts + shared/seed.ts), so the
// Convex-backed store adapter maps 1:1 (frontend `id` <-> Convex `_id`).
export default defineSchema({
  ...authTables,
  ...commentsTables,
  ...notionTables,

  konsultanClients: defineTable({
    name: v.string(),
    company: v.string(),
    industry: v.string(),
    email: v.string(),
    phone: v.string(),
    city: v.string(),
    status: v.union(v.literal("lead"), v.literal("active"), v.literal("completed")),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  konsultanProposals: defineTable({
    clientId: v.string(),
    title: v.string(),
    scope: v.string(),
    valueLabel: v.string(),
    durationLabel: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  konsultanContracts: defineTable({
    proposalId: v.string(),
    clientId: v.string(),
    title: v.string(),
    termsSummary: v.string(),
    status: v.union(v.literal("draft"), v.literal("signed"), v.literal("expired")),
    signedAt: v.number(),
    endsAt: v.number(),
  }).index("by_status", ["status"]),

  konsultanProjects: defineTable({
    contractId: v.string(),
    clientId: v.string(),
    name: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("kickoff"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("delivered"),
    ),
    progress: v.number(),
    startedAt: v.number(),
    endsAt: v.number(),
    icon: v.optional(v.string()),
    image: v.optional(v.string()),
  }).index("by_status", ["status"]),

  konsultanInvoices: defineTable({
    projectId: v.string(),
    clientId: v.string(),
    number: v.string(),
    amountLabel: v.string(),
    ppnLabel: v.string(),
    totalLabel: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
    ),
    dueAt: v.number(),
    issuedAt: v.number(),
  }).index("by_status", ["status"]),

  konsultanDocuments: defineTable({
    projectId: v.string(),
    title: v.string(),
    kind: v.union(
      v.literal("deliverable"),
      v.literal("memo"),
      v.literal("minutes"),
      v.literal("report"),
    ),
    status: v.union(v.literal("draft"), v.literal("shared")),
    updatedAt: v.number(),
  }),

  konsultanCalendarEvents: defineTable({
    title: v.string(),
    clientId: v.optional(v.string()),
    projectId: v.optional(v.string()),
    kind: v.union(
      v.literal("session"),
      v.literal("deadline"),
      v.literal("workshop"),
      v.literal("internal"),
    ),
    dayOfWeek: v.number(),
    hour: v.number(),
    durationHours: v.number(),
    location: v.string(),
    notes: v.optional(v.string()),
  }),

  konsultanKbArticles: defineTable({
    slug: v.string(),
    title: v.string(),
    category: v.union(
      v.literal("Strategi"),
      v.literal("Operasi"),
      v.literal("Organisasi"),
      v.literal("M&A"),
      v.literal("Workshop"),
      v.literal("Template"),
    ),
    summary: v.string(),
    body: v.string(),
    author: v.string(),
    updatedAt: v.number(),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // Public productised offerings (services page + landing services section).
  konsultanServices: defineTable({
    slug: v.string(),
    name: v.string(),
    tagline: v.string(),
    priceLabel: v.string(),
    durationLabel: v.string(),
    bullets: v.array(v.string()),
    outcomes: v.array(v.string()),
    featured: v.optional(v.boolean()),
    accent: v.union(
      v.literal("violet"),
      v.literal("amber"),
      v.literal("emerald"),
      v.literal("rose"),
    ),
    order: v.number(),
  }).index("by_slug", ["slug"]),

  // Public team / consultants directory (team page).
  konsultanTeam: defineTable({
    slug: v.string(),
    name: v.string(),
    role: v.string(),
    city: v.string(),
    initials: v.string(),
    bio: v.string(),
    expertise: v.array(v.string()),
    yearsExp: v.number(),
    linkedinUrl: v.optional(v.string()),
    order: v.number(),
  }).index("by_slug", ["slug"]),

  // Public FAQ entries (faq page + landing faq section).
  konsultanFaqs: defineTable({
    category: v.union(
      v.literal("Umum"),
      v.literal("Pricing"),
      v.literal("Proses"),
      v.literal("Engagement"),
    ),
    question: v.string(),
    answer: v.string(),
    order: v.number(),
  }),

  subscribers: defineTable({
    email: v.string(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("unsubscribed")),
    source: v.string(),
    ts: v.number(),
  }).index("by_email", ["email"]),

  // Public contact-form submissions (contact page). Write-only inbox: the
  // public form inserts, the dashboard reads/deletes. Mirrors `subscribers`.
  konsultanContactSubmissions: defineTable({
    name: v.string(),
    company: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.string()),
    topic: v.optional(v.string()),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("read")),
    ts: v.number(),
  }).index("by_status", ["status"]),

  // Page-builder + landing: complex nested structures stored as blobs keyed by
  // the frontend's string id (PageEntry.id / LandingSection.id).
  pages: defineTable({
    entryId: v.string(),
    slug: v.string(),
    data: v.any(),
  })
    .index("by_entryId", ["entryId"])
    .index("by_slug", ["slug"]),

  landingSections: defineTable({
    sectionId: v.string(),
    data: v.any(),
  }).index("by_sectionId", ["sectionId"]),

  // Singleton site config — onboarding wizard + admin Settings write this.
  siteSettings: defineTable({
    siteName: v.optional(v.string()),
    tagline: v.optional(v.string()),
    ownerName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactAddress: v.optional(v.string()),
    brandColor: v.optional(v.string()),
    themeDefault: v.optional(v.string()),
    themePreset: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    socials: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    analyticsId: v.optional(v.string()),
    onboardedAt: v.optional(v.number()),
  }),

  // Admin-panel "AI config" block. Singleton row holding the active model +
  // sampling config (mirrors the AiConfig type). One row.
  adminAiConfig: defineTable({
    activeModelId: v.string(),
    systemPrompt: v.string(),
    temperature: v.number(),
    maxOutputTokens: v.number(),
  }),

  // Admin-panel "AI config" moderation rules. One row per rule, keyed by the
  // frontend's stable string id (ModerationRule.id).
  adminModerationRules: defineTable({
    ruleId: v.string(),
    label: v.string(),
    description: v.string(),
    enabled: v.boolean(),
    threshold: v.optional(v.number()),
  }).index("by_ruleId", ["ruleId"]),

  // Admin-panel "Settings" block — WORKSPACE settings (distinct from the
  // public siteSettings singleton). Identity = one row; integrations + apiKeys
  // = one row each keyed by their stable frontend string id.
  adminWorkspaceSettings: defineTable({
    name: v.string(),
    slug: v.string(),
    timezone: v.string(),
    language: v.string(),
    contactEmail: v.string(),
  }),

  adminIntegrations: defineTable({
    integrationId: v.string(),
    label: v.string(),
    category: v.union(
      v.literal("messaging"),
      v.literal("email"),
      v.literal("payments"),
      v.literal("deploy"),
      v.literal("vcs"),
    ),
    status: v.union(
      v.literal("connected"),
      v.literal("disconnected"),
      v.literal("error"),
    ),
    detail: v.string(),
    docsUrl: v.string(),
  }).index("by_integrationId", ["integrationId"]),

  adminApiKeys: defineTable({
    keyId: v.string(),
    label: v.string(),
    tail: v.string(),
    createdAt: v.string(),
    lastUsedAt: v.optional(v.string()),
    scope: v.union(v.literal("read"), v.literal("read-write"), v.literal("admin")),
  }).index("by_keyId", ["keyId"]),

  // Admin-panel "Webhooks" block — endpoints + deliveries (auth-guarded). Keyed
  // by a stable frontend string id (whId / dlId) so the binding's `id: string`
  // contract holds without leaking Convex _id into the view.
  adminWebhooks: defineTable({
    whId: v.string(),
    url: v.string(),
    description: v.string(),
    events: v.array(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("failing"),
    ),
    secretTail: v.string(),
    lastDeliveryAt: v.union(v.string(), v.null()),
    failingRetries: v.number(),
  }).index("by_whId", ["whId"]),

  adminWebhookDeliveries: defineTable({
    dlId: v.string(),
    endpointId: v.string(), // the endpoint's whId
    event: v.string(),
    at: v.string(),
    httpCode: v.number(),
    status: v.union(
      v.literal("delivered"),
      v.literal("failed"),
      v.literal("pending"),
      v.literal("retry"),
    ),
    durationMs: v.number(),
    attempt: v.number(),
  }).index("by_endpointId", ["endpointId"]),

  // Admin-panel "Audit log" block — real admin-activity stream. Rows are
  // appended by the other admin mutations (users.changeRole/revoke,
  // webhooks.add/remove/fire, aiConfig.setConfig/reset, settings.setIdentity/
  // revokeKey) via the shared logAudit() helper. Keyed by a stable frontend
  // string id (evId) so the binding's `id: string` contract holds.
  adminAuditEvents: defineTable({
    evId: v.string(),
    at: v.string(), // ISO datetime
    actorId: v.string(),
    actorName: v.string(),
    actorInitials: v.string(),
    actorRole: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer"),
      v.literal("system"),
    ),
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("publish"),
      v.literal("unpublish"),
      v.literal("invite"),
      v.literal("revoke"),
      v.literal("login"),
      v.literal("logout"),
      v.literal("export"),
    ),
    entityType: v.union(
      v.literal("page"),
      v.literal("user"),
      v.literal("role"),
      v.literal("webhook"),
      v.literal("setting"),
      v.literal("post"),
      v.literal("workflow"),
      v.literal("session"),
    ),
    entityId: v.string(),
    entityLabel: v.string(),
    severity: v.union(v.literal("info"), v.literal("warn"), v.literal("alert")),
    diffSummary: v.optional(v.string()),
  }).index("by_at", ["at"]),

  // Admin-panel "Users" block — role mapping over the @convex-dev/auth `users`
  // table (which stays untouched). One row per user whose role has been changed
  // from the derived default. revoke = delete the row (user drops to default).
  adminRoles: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer"),
    ),
  }).index("by_userId", ["userId"]),
});
