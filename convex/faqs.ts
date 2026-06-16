import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

const CATEGORY = v.union(
  v.literal("Umum"),
  v.literal("Pricing"),
  v.literal("Proses"),
  v.literal("Engagement"),
);

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query("konsultanFaqs").take(300),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("konsultanFaqs")),
    category: CATEGORY,
    question: v.string(),
    answer: v.string(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("konsultanFaqs", data);
  },
});

export const remove = mutation({
  args: { id: v.id("konsultanFaqs") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
