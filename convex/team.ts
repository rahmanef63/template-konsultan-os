import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query("konsultanTeam").take(200),
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) =>
    ctx.db.query("konsultanTeam").withIndex("by_slug", (q) => q.eq("slug", slug)).first(),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("konsultanTeam")),
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
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("konsultanTeam", data);
  },
});

export const remove = mutation({
  args: { id: v.id("konsultanTeam") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
