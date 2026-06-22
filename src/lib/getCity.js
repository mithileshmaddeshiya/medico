import { cityData } from "@/data/cityData";

export async function getCity(slug) {
  return cityData[slug] || null;
}
