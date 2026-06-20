import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalUser, requireUser } from "./_shared/auth";

// Admin inbox — list latest submissions. Guarded like subscribers.list.
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    if (!(await optionalUser(ctx))) return [];
    return await ctx.db.query("konsultanContactSubmissions").order("desc").take(limit ?? 200);
  },
});

// Public submit — no auth (mirrors subscribers.subscribe). Validates inputs.
export const submit = mutation({
  args: {
    name: v.string(),
    company: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.string()),
    topic: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim();
    const message = args.message.trim();
    if (!name) throw new Error("Nama wajib diisi");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email tidak valid");
    if (!message) throw new Error("Detail tantangan wajib diisi");
    return await ctx.db.insert("konsultanContactSubmissions", {
      name,
      company: args.company?.trim() || undefined,
      email,
      phone: args.phone?.trim() || undefined,
      topic: args.topic?.trim() || undefined,
      message,
      status: "new",
      ts: Date.now(),
    });
  },
});

// Mark read — admin only (mirrors team/faq mutation guards).
export const markRead = mutation({
  args: { id: v.id("konsultanContactSubmissions") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.patch(id, { status: "read" });
  },
});

export const remove = mutation({
  args: { id: v.id("konsultanContactSubmissions") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
