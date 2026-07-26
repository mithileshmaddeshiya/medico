export default function sitemap() {
  const base = "https://www.medicobharat.com";

  return [
    {
      url: `${base}/sitemap/static.xml`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${base}/sitemap/medicine-delivery.xml`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${base}/sitemap/lab-test.xml`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${base}/sitemap/blogs.xml`,
      lastModified: new Date().toISOString(),
    },
  ];
}
