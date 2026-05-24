const cities = [
  "deoria",
  "salempur",
];

export default function sitemap() {

  const cityPages = cities.map((city) => ({
    url: `https://www.medicobharat.com/medicine-delivery-${city}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
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