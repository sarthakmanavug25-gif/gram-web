import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import {
  offlineReply,
  replyLanguage,
  type AssistantContext,
} from "@/lib/assistant";

export const runtime = "nodejs";

const SYSTEM = `You are the GramConnect in-app assistant for Indian farmers. Help the farmer navigate the app (Home, Crop Doctor, Smart Advisory, Farm Expenses), answer basic farming questions, and explain features. Keep answers short, simple and practical — 2-4 sentences or a small bullet list. Always reply in the language the user writes in: Hindi for Hindi or Hinglish, English for English. Amounts are Indian rupees. When the farmer sounds discouraged or asks to be motivated, give one short, genuine line of encouragement rooted in farming life — no empty slogans. Never invent numbers: use the farmer data provided below.`;

function contextBlock(ctx: AssistantContext) {
  return [
    `Farmer name: ${ctx.name ?? "Farmer"}`,
    `Farm size: ${ctx.farmSizeAcres ?? "unknown"} acres`,
    `Season: ${ctx.season ?? "unknown"}`,
    `Spend this month: ₹${ctx.monthSpend ?? 0} of a ₹${ctx.monthlyBudget ?? 0} budget across ${ctx.entries ?? 0} entries`,
    `Largest expense category: ${ctx.topCategory ?? "none yet"}${
      ctx.topCategoryAmount ? ` (₹${ctx.topCategoryAmount})` : ""
    }`,
    `Auto sprinkler demand: ${ctx.sprinklerPercent ?? 0}%`,
    `Last crop scan: ${ctx.lastScan ?? "none yet"}`,
    `App language: ${ctx.lang === "hi" ? "Hindi" : "English"}`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const { messages = [], context = {} } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    context: AssistantContext;
  };

  const lastUser =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(offlineReply(lastUser, context), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const client = new Anthropic({ apiKey });
  const lang = replyLanguage(lastUser, context.lang ?? "en");

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 600,
          system: `${SYSTEM}\n\nReply in ${lang === "hi" ? "Hindi (Devanagari)" : "English"}.\n\nCurrent farmer data:\n${contextBlock(context)}`,
          messages: messages.slice(-12).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        });
        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch {
        controller.enqueue(encoder.encode(offlineReply(lastUser, context)));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
