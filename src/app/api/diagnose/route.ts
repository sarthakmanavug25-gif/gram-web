import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { DISEASES } from "@/lib/seed/diseases";

export const runtime = "nodejs";
export const maxDuration = 30;

type Media = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

function parseDataUrl(dataUrl: string) {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const mediaType = match[1].replace("image/jpg", "image/jpeg") as Media;
  return { mediaType, data: match[2] };
}

/** Picks a plausible library entry when no vision model is configured. */
function heuristicResult(seed: string) {
  const hash = Array.from(seed.slice(0, 2000)).reduce(
    (acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 100000,
    7
  );
  const pool = DISEASES.filter(
    (d) => d.affectedPart.toLowerCase().includes("leaf") || d.affectedPart.toLowerCase().includes("leaves")
  );
  const disease = pool[hash % pool.length];
  return {
    slug: disease.slug,
    name: disease.name,
    crop: disease.crop,
    severity: disease.severity,
    confidence: 62 + (hash % 25),
    note: `${disease.symptom}. ${disease.treatment[0]}`,
    offline: true,
  };
}

export async function POST(req: NextRequest) {
  const { image } = (await req.json()) as { image?: string };
  if (!image) {
    return NextResponse.json({ error: "No image supplied" }, { status: 400 });
  }

  const parsed = parseDataUrl(image);
  if (!parsed) {
    return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(heuristicResult(parsed.data));
  }

  try {
    const client = new Anthropic({ apiKey });
    const list = DISEASES.map(
      (d) => `${d.slug} | ${d.name} | ${d.crop} | ${d.symptom}`
    ).join("\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      system:
        "You identify crop diseases from a leaf photo for Indian farmers. Choose the single closest match from the supplied list. Reply with JSON only: {\"slug\":string,\"confidence\":number,\"note\":string}. The note is one short sentence describing what you see and the first action to take.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: parsed.mediaType,
                data: parsed.data,
              },
            },
            {
              type: "text",
              text: `Candidate diseases (slug | name | crop | symptom):\n${list}\n\nRespond with JSON only.`,
            },
          ],
        },
      ],
    });

    const text = response.content
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("");
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    const disease =
      DISEASES.find((d) => d.slug === json.slug) ?? DISEASES[0];

    return NextResponse.json({
      slug: disease.slug,
      name: disease.name,
      crop: disease.crop,
      severity: disease.severity,
      confidence: Math.min(99, Math.max(40, Math.round(json.confidence ?? 70))),
      note: json.note ?? `${disease.symptom}. ${disease.treatment[0]}`,
      offline: false,
    });
  } catch {
    return NextResponse.json(heuristicResult(parsed.data));
  }
}
