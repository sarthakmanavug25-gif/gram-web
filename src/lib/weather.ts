export type Weather = {
  temperature: number;
  condition: string;
  humidity: number;
  rainChance: number;
  windKph: number;
  high: number;
  low: number;
  isDay: boolean;
  fallback: boolean;
};

const WMO: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Storm with hail",
  99: "Storm with hail",
};

export const FALLBACK_WEATHER: Weather = {
  temperature: 34,
  condition: "Partly cloudy",
  humidity: 68,
  rainChance: 40,
  windKph: 8,
  high: 36,
  low: 26,
  isDay: true,
  fallback: true,
};

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<Weather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto&forecast_days=1`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
    const json = await res.json();
    const c = json.current;
    const d = json.daily;
    return {
      temperature: Math.round(c.temperature_2m),
      condition: WMO[c.weather_code] ?? "Clear",
      humidity: Math.round(c.relative_humidity_2m),
      rainChance: Math.round(d.precipitation_probability_max?.[0] ?? 0),
      windKph: Math.round(c.wind_speed_10m),
      high: Math.round(d.temperature_2m_max[0]),
      low: Math.round(d.temperature_2m_min[0]),
      isDay: c.is_day === 1,
      fallback: false,
    };
  } catch {
    return FALLBACK_WEATHER;
  }
}

export type SprinklerNoteKey =
  | "sprinkler.note.temp"
  | "sprinkler.note.humidity"
  | "sprinkler.note.rain"
  | "sprinkler.note.wind"
  | "sprinkler.note.steady";

export type SprinklerSummaryKey =
  | "sprinkler.high"
  | "sprinkler.medium"
  | "sprinkler.low";

/**
 * Sprinkler demand derived from live weather: hotter, drier and windier
 * conditions push runtime up, a wet forecast pulls it down.
 */
export function sprinklerAdvice(w: Weather) {
  const heat = Math.max(0, w.temperature - 22) * 3.4;
  const dryness = Math.max(0, 70 - w.humidity) * 0.6;
  const wind = w.windKph * 0.4;
  const rainRelief = w.rainChance * 0.45;
  const percent = Math.max(
    10,
    Math.min(98, Math.round(heat + dryness + wind - rainRelief))
  );

  const level = percent >= 65 ? "High" : percent >= 35 ? "Medium" : "Low";

  type Note = {
    key: SprinklerNoteKey;
    vars?: Record<string, number>;
    color: string;
  };
  const notes: Note[] = [];
  if (w.temperature >= 32)
    notes.push({
      key: "sprinkler.note.temp",
      vars: { n: w.temperature },
      color: "var(--amber)",
    });
  if (w.humidity < 50)
    notes.push({
      key: "sprinkler.note.humidity",
      vars: { n: w.humidity },
      color: "var(--orange)",
    });
  if (w.rainChance >= 50)
    notes.push({
      key: "sprinkler.note.rain",
      vars: { n: w.rainChance },
      color: "var(--blue-info)",
    });
  if (w.windKph >= 20)
    notes.push({
      key: "sprinkler.note.wind",
      vars: { n: w.windKph },
      color: "var(--text-secondary)",
    });
  if (notes.length === 0)
    notes.push({ key: "sprinkler.note.steady", color: "var(--green-primary)" });

  const summaryKey: SprinklerSummaryKey =
    percent >= 65
      ? "sprinkler.high"
      : percent >= 35
        ? "sprinkler.medium"
        : "sprinkler.low";

  return { percent, level, summaryKey, notes };
}
