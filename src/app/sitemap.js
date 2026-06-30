import { cityData } from "@/data/cityData";
import { blogs } from "@/data/blogData";

export default function sitemap() {
  const baseUrl = "https://www.medicobharat.com";

  // 1. Dynamic City Pages
  const cityPages = Object.values(cityData).map((city) => ({
    url: `${baseUrl}/medicine-delivery/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: city.slug === "deoria" ? 1.0 : 0.9,
  }));

  // 2. Dynamic Blog Pages
  const blogPages = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.category}/${blog.city}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Static Pages (Jo Missing The)
  const staticRoutes = ["/about", "/contact", "/privacy", "/terms"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...cityPages,
    ...blogPages,
    ...staticRoutes, // Static pages ko yahan merge kar diya
  ];
}