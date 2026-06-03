"use node";

/**
 * ai-chat backend — real LLM call via the Vercel `ai` SDK + @ai-sdk/anthropic.
 *
 * Key-guarded: ANTHROPIC_API_KEY is set by the site owner on the Convex
 * deployment at deploy time. When it is NOT set the action does NOT throw —
 * it returns `{ ok: false, notice }` so the chat UI degrades gracefully and
 * the build / prerender never depends on the key being present.
 *
 * konsultan has no `aiConfig` singleton, so the system prompt uses a sensible
 * default that makes the public assistant speak as the consulting firm's
 * front-desk assistant (Bahasa Indonesia, mirroring the site copy).
 */

import { action } from "../../_generated/server";
import { v } from "convex/values";

const MODEL = "claude-3-5-haiku-latest";

const DEFAULT_SYSTEM = [
  "Kamu adalah asisten resepsionis virtual untuk sebuah firma konsultan.",
  "Bahasamu ramah, ringkas, profesional, dan dalam Bahasa Indonesia.",
  "Bantu calon klien memahami layanan (strategi, operasi, organisasi, M&A),",
  "cara memulai kerja sama, dan arahkan ke halaman Kontak untuk penawaran.",
  "Jangan mengarang harga pasti — tawarkan konsultasi singkat untuk estimasi.",
].join(" ");

export const chat = action({
  args: {
    prompt: v.string(),
    history: v.optional(
      v.array(
        v.object({
          role: v.union(v.literal("user"), v.literal("assistant")),
          content: v.string(),
        }),
      ),
    ),
  },
  handler: async (
    _ctx,
    { prompt, history },
  ): Promise<{ ok: boolean; text?: string; notice?: string }> => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return {
        ok: false,
        notice:
          "AI chat is not configured yet. The site owner must set ANTHROPIC_API_KEY on the Convex deployment to enable live replies.",
      };
    }

    try {
      const { generateText } = await import("ai");
      const { createAnthropic } = await import("@ai-sdk/anthropic");
      const anthropic = createAnthropic({ apiKey: key });

      const messages = [
        ...(history ?? []),
        { role: "user" as const, content: prompt },
      ];

      const { text } = await generateText({
        model: anthropic(MODEL),
        system: DEFAULT_SYSTEM,
        messages,
        maxTokens: 600,
      });

      return { ok: true, text };
    } catch (e) {
      return {
        ok: false,
        notice: `AI request failed: ${(e as Error).message}`,
      };
    }
  },
});
