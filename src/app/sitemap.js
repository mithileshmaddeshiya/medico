import { cityData } from "@/data/cityData";
import { blogs } from "@/data/blogData";

export default function sitemap() {

  const cityPages = Object.values(cityData).map((city) => ({
    url: `https://www.medicobharat.com/medicine-delivery/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: city.slug === "deoria" ? 1.0 : 0.9,
  }));

  const blogPages = blogs.map((blog) => ({
    url: `https://www.medicobharat.com/blogs/${blog.category}/${blog.city}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://www.medicobharat.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    ...cityPages,
    ...blogPages,
  ];
}