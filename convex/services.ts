import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

const ACCENT = v.union(
  v.literal("violet"),
  v.literal("amber"),
  v.literal("emerald"),
  v.literal("rose"),
);

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query("konsultanServices").take(200),
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) =>
    ctx.db.query("konsultanServices").withIndex("by_slug", (q) => q.eq("slug", slug)).first(),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("konsultanServices")),
    slug: v.string(),
    name: v.string(),
    tagline: v.string(),
    priceLabel: v.string(),
    durationLabel: v.string(),
    bullets: v.array(v.string()),
    outcomes: v.array(v.string()),
    featured: v.optional(v.boolean()),
    accent: ACCENT,
    order: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("konsultanServices", data);
  },
});

export const remove = mutation({
  args: { id: v.id("konsultanServices") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
