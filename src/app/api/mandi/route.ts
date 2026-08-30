import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 0;

const RESOURCE = "9ef84268-d588-465a-a308-a864a43d0070";
const API_URL = `https://api.data.gov.in/resource/${RESOURCE}`;

type GovtRecord = {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  arrival_date?: string;
  modal_price?: string | number;
  min_price?: string | number;
  max_price?: string | number;
};

const FALLBACK = [
  { commodity: "Paddy", market: "Nashik APMC", district: "Nashik", modalPrice: 2410, minPrice: 2320, maxPrice: 2490 },
  { commodity: "Wheat", market: "Nashik APMC", district: "Nashik", modalPrice: 2380, minPrice: 2290, maxPrice: 2440 },
  { commodity: "Maize", market: "Sinnar", district: "Nashik", modalPrice: 2290, minPrice: 2200, maxPrice: 2350 },
  { commodity: "Cotton", market: "Yeola", district: "Nashik", modalPrice: 7290, minPrice: 7040, maxPrice: 7400 },
];

function number(value: unknown) {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

/**
 * Proxies the official AGMARKNET daily-price dataset. The server-only API key
 * is never sent to the browser. A meaningful local fallback keeps the Market
 * page useful during government API outages or before a key is added.
 */
export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state") || "Maharashtra";
  const commodity = req.nextUrl.searchParams.get("commodity") || "";
  const key = process.env.DATA_GOV_API_KEY;

  if (!key) {
    return NextResponse.json({
      source: "fallback",
      message: "Add DATA_GOV_API_KEY for live AGMARKNET rates.",
      updatedAt: new Date().toISOString(),
      prices: FALLBACK.filter(
        (row) => !commodity || row.commodity.toLowerCase() === commodity.toLowerCase()
      ),
    });
  }

  const params = new URLSearchParams({
    "api-key": key,
    format: "json",
    offset: "0",
    limit: "30",
    "filters[state.keyword]": state,
  });
  if (commodity) params.set("filters[commodity]", commodity);

  try {
    const response = await fetch(`${API_URL}?${params}`, {
      next: { revalidate: 900 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Government API responded ${response.status}`);

    const payload = (await response.json()) as { records?: GovtRecord[] };
    const prices = (payload.records ?? [])
      .map((record) => ({
        commodity: record.commodity ?? "Unknown crop",
        market: record.market ?? "Local market",
        district: record.district ?? state,
        variety: record.variety ?? "",
        arrivalDate: record.arrival_date ?? "",
        modalPrice: number(record.modal_price),
        minPrice: number(record.min_price),
        maxPrice: number(record.max_price),
      }))
      .filter((row) => row.modalPrice > 0)
      .slice(0, 12);

    if (!prices.length) throw new Error("No matching mandi records");

    return NextResponse.json({
      source: "AGMARKNET",
      updatedAt: new Date().toISOString(),
      prices,
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      message: "Live AGMARKNET data is temporarily unavailable.",
      updatedAt: new Date().toISOString(),
      prices: FALLBACK.filter(
        (row) => !commodity || row.commodity.toLowerCase() === commodity.toLowerCase()
      ),
    });
  }
}
