import Link from "next/link";

const latestBlogs = [
  {
    title: "Buy Medicines Online in Deoria",
    description:
      "Order genuine medicines online in Deoria with fast home delivery and trusted pharmacy support.",
    href: "/blogs/buy-medicines-online/deoria",
  },
  {
    title: "Online Medicine Delivery in Deoria",
    description:
      "Get medicines delivered to your doorstep in Deoria with quick and reliable service.",
    href: "/blogs/online-medicine-delivery/deoria",
  },
  {
    title: "Medicine Home Delivery in Deoria",
    description:
      "Safe and convenient medicine home delivery service available across Deoria.",
    href: "/blogs/medicine-home-delivery/deoria",
  },
];

export default function LatestBlogs() {
  return (
    <section className="hidden md:block max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          Latest Health Guides
        </span>

        <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">
          Latest Medicine Delivery Blogs
        </h2>

        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Helpful guides about online medicine ordering, home delivery and
          pharmacy services in Deoria.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {latestBlogs.map((blog, index) => (
          <article
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {blog.title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              {blog.description}
            </p>

            <Link
              href={blog.href}
              className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
            >
              Read Guide →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}