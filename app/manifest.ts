import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Objednávky LIMA",
    short_name: "Objednávky",
    description: "Objednávkový systém obědů a pizzy",
    start_url: "/",
    display: "standalone",
    background_color: "#16324a",
    theme_color: "#ea580c",
    orientation: "any",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
