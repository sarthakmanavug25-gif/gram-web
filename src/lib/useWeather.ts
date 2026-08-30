"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchWeather, type Weather } from "./weather";
import { useApp } from "./store";

export function useWeather() {
  const profile = useApp((s) => s.profile);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(
    async (lat = profile.latitude, lon = profile.longitude) => {
      setLoading(true);
      const w = await fetchWeather(lat, lon);
      setWeather(w);
      setUpdatedAt(new Date());
      setLoading(false);
    },
    [profile.latitude, profile.longitude]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const w = await fetchWeather(profile.latitude, profile.longitude);
      if (!cancelled) {
        setWeather(w);
        setUpdatedAt(new Date());
        setLoading(false);
      }
    })();

    // Browser geolocation refines the reading when the farmer allows it.
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const w = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
          if (!cancelled) {
            setWeather(w);
            setUpdatedAt(new Date());
          }
        },
        () => {},
        { timeout: 6000, maximumAge: 600000 }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [profile.latitude, profile.longitude]);

  return { weather, loading, updatedAt, refresh: load };
}
