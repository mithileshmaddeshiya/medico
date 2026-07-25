import { cityData } from "@/data/cityData";
import { blogs } from "@/data/blogData";
import { getLabCities } from "@/lib/labCities";
import { SITE as baseUrl } from "@/lib/site";

export default async function sitemap() {
  // 1. Medicine city pages (local data)
  const cityPages = Object.values(cityData).map((city) => ({
    url: `${baseUrl}/medicine-delivery/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: city.slug === "deoria" ? 1.0 : 0.9,
  }));

  // 2. Lab test city pages (local data) — the first city in the list is the
  //    flagship, so it carries the higher priority.
  const labCities = await getLabCities();
  const labPages = labCities.map((city, i) => ({
    url: `${baseUrl}/lab-test/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: i === 0 ? 0.9 : 0.8,
  }));

  // 3. Dynamic Blog Pages
  const blogPages = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.category}/${blog.city}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 4. Static Pages
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
    ...labPages,
    ...blogPages,
    ...staticRoutes,
  ];
}
