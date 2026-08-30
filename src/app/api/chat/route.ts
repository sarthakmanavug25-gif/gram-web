import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

type Ctx = {
  name?: string;
  farmSizeAcres?: number;
  season?: string;
  monthSpend?: number;
  monthlyBudget?: number;
  entries?: number;
  sprinklerPercent?: number;
  lastScan?: string | null;
  topCategory?: string | null;
};

const SYSTEM = `You are the GramConnect in-app assistant. Help the farmer navigate the app (Home, Crop Doctor, Smart Advisory, Farm Expenses), answer basic farming questions, and explain features. Keep answers short, simple, practical, in the language the user writes in (support Hindi + English + Hinglish). Prefer 2-4 short sentences or a small bullet list. Amounts are Indian rupees.`;

function contextBlock(ctx: Ctx) {
  return [
    `Farmer name: ${ctx.name ?? "Farmer"}`,
    `Farm size: ${ctx.farmSizeAcres ?? "unknown"} acres`,
    `Season: ${ctx.season ?? "unknown"}`,
    `Spend this month: ₹${ctx.monthSpend ?? 0} of a ₹${ctx.monthlyBudget ?? 0} budget across ${ctx.entries ?? 0} entries`,
    `Largest expense category: ${ctx.topCategory ?? "none yet"}`,
    `Auto sprinkler demand: ${ctx.sprinklerPercent ?? 0}%`,
    `Last crop scan: ${ctx.lastScan ?? "none yet"}`,
  ].join("\n");
}

/** Deterministic answers used when no Anthropic key is configured. */
function offlineReply(question: string, ctx: Ctx) {
  const q = question.toLowerCase();
  const spend = `₹${(ctx.monthSpend ?? 0).toLocaleString("en-IN")}`;
  const budget = `₹${(ctx.monthlyBudget ?? 0).toLocaleString("en-IN")}`;

  if (/scan|photo|leaf|camera|रोग|फोटो/.test(q))
    return "Open Crop Doctor from the bottom bar, stay on the Scan tab, then tap Camera to click a leaf photo or Library to pick one. You get a likely disease with treatment steps — always confirm with your local agri officer before spraying.";
  if (/spend|expense|kharch|खर्च|budget|paisa/.test(q))
    return `You have spent ${spend} this month across ${ctx.entries ?? 0} entries, against a ${budget} budget. ${ctx.topCategory ? `${ctx.topCategory} is your biggest head — check Spend by Category on the Expenses page.` : "Add your first entry with the + button on the Expenses page."}`;
  if (/disease|alert|blast|bollworm|कीट/.test(q))
    return "Today's watch: scout rice for blast in humid spells and cotton for bollworm. Home shows the current alerts under Today's Priorities, and the Diseases tab in Crop Doctor has all 25 guides with treatment steps.";
  if (/sprinkler|irrigat|water|पानी|सिंचाई/.test(q))
    return `Auto sprinkler reads live weather — temperature, humidity, rain chance and wind — and turns it into a runtime demand, currently ${ctx.sprinklerPercent ?? 0}%. Above 65% means hot and dry, so increase runtime; below 35% you can cut back. Toggle AUTOMATIC on the Advisor page to control it by hand.`;
  if (/weather|rain|mausam|मौसम/.test(q))
    return "The Advisor page pulls live weather for your saved location: temperature, humidity, rain chance, wind and today's high/low, plus the season advisory and the India climate calendar.";
  if (/msp|price|mandi|rate|भाव/.test(q))
    return "Home has the MSP Reference 2024-25 table — paddy ₹2,300/q, wheat ₹2,275/q, maize ₹2,225/q. Tap Compare mandi buyers to open the market page.";
  return `I can help with Crop Doctor scans, disease guides, your expenses and the weather advisory. You are farming ${ctx.farmSizeAcres ?? 2} acres this ${ctx.season ?? "season"} — ask me about any of those.`;
}

export async function POST(req: NextRequest) {
  const { messages = [], context = {} } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    context: Ctx;
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

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 600,
          system: `${SYSTEM}\n\nCurrent farmer data:\n${contextBlock(context)}`,
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
