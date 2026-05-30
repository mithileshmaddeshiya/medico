import { cityData } from "@/data/cityData";

export default function sitemap() {

  const cityPages = Object.values(cityData).map((city) => ({
    url: `https://www.medicobharat.com/medicine-delivery/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: city.slug === "deoria" ? 1.0 : 0.9,
  }));

  return [
    {
      url: "https://www.medicobharat.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    ...cityPages,
  ];
}