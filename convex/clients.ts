import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalUser, requireUser } from "./_shared/auth";

const STATUS = v.union(v.literal("lead"), v.literal("active"), v.literal("completed"));

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("konsultanClients").take(500);
    if (await optionalUser(ctx)) return rows;
    // Public case-study pages join project.clientId -> client to render
    // company/industry/city. Expose only those public fields to anon; never
    // email/phone/contact name/CRM status. (Cycle 1's blanket [] blanked the
    // public case studies — this restores them without leaking PII.)
    return rows.map((c) => ({
      _id: c._id,
      _creationTime: c._creationTime,
      company: c.company,
      industry: c.industry,
      city: c.city,
    }));
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("konsultanClients")),
    name: v.string(),
    company: v.string(),
    industry: v.string(),
    email: v.string(),
    phone: v.string(),
    city: v.string(),
    status: STATUS,
    createdAt: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("konsultanClients", data);
  },
});

export const remove = mutation({
  args: { id: v.id("konsultanClients") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
