import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GramConnect — Smart Farming Assistant",
    short_name: "GramConnect",
    description: "Crop health, weather advice and farm expenses for Indian farmers.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0d0a",
    theme_color: "#0a0d0a",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
