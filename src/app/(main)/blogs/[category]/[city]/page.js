import { blogs } from "@/data/blogData";
import { getLabCity } from "@/lib/labCities";
import { SITE } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * The article's share card, rendered by the `og/route.js` handler beside this
 * file.
 *
 * `blog.image` in blogData.js points at /public/blogs/*.webp — files that do
 * not exist. Using the generated route instead means the OG tags and the
 * BlogPosting schema both reference an image that actually resolves, which is
 * what Google requires before it will show the rich result at all.
 */
const ogImage = (category, city) =>
  `${SITE}/blogs/${category}/${city}/og`;

export async function generateStaticParams() {
    return blogs.map((blog) => ({
        category: blog.category,
        city: blog.city,
    }));
}

export async function generateMetadata({ params }) {
    const { category, city } = await params;

    const blog = blogs.find(
        (item) =>
            item.category === category &&
            item.city === city
    );

    if (!blog) return {};

    return {
        title: blog.title,
        description: blog.description,

        keywords: blog.keywords,

        robots: blog.robots,

        alternates: {
            canonical: blog.canonical,
        },

        openGraph: {
            title: blog.title,
            description: blog.description,
            url: blog.canonical,
            siteName: "MedicoBharat",
            locale: "en_IN",
            images: [
                {
                    url: ogImage(category, city),
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                },
            ],
            type: "article",
            publishedTime: blog.publishedAt,
            modifiedTime: blog.updatedAt,
        },

        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.description,
            images: [ogImage(category, city)],
        },
    };
}


export default async function BlogPage({ params }) {
    const { category, city } = await params;

    const blog = blogs.find(
        (item) =>
            item.category === category &&
            item.city === city
    );


    if (!blog) {
        notFound();
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",

        headline: blog.title,
        description: blog.description,
        image: [ogImage(category, city)],

        datePublished: blog.publishedAt,
        dateModified: blog.updatedAt,

        author: {
            "@type": "Organization",
            name: blog.author.name,
            url: blog.author.url,
        },

        publisher: {
            "@type": "Organization",
            name: blog.publisher.name,

            logo: {
                "@type": "ImageObject",
                url: blog.publisher.logo,
            },
        },

        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": blog.canonical,
        },
    };


    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",

        mainEntity: blog.faqs?.map((faq) => ({
            "@type": "Question",
            name: faq.question,

            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })) || [],
    };

    const relatedBlogs = blogs.filter(
        (item) =>
            item.city === city &&
            item.category !== category
    );

    // The same town in the lab section, or null when we do not run lab tests
    // there. Someone reading about medicine delivery in Deoria is the same
    // person who needs a blood test in Deoria, and until this the articles
    // linked only into /medicine-delivery/*.
    const labCity = await getLabCity(city);


    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema),
                }}
            />


            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />


            <div className="mt-10">
                <Link
                    href={`/medicine-delivery/${city}`}
                    className="text-green-600 font-semibold hover:underline"
                >
                    View Medicine Delivery in {city}
                </Link>
            </div>

            <article className="max-w-5xl mx-auto px-4 md:px-6 pt-32 pb-16">
                {/* Header */} <div className="mb-10 border-b pb-6"> <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Medicine Delivery </span>

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                        {blog.title}
                    </h1>

                    <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                        {blog.description}
                    </p>
                </div>

                {/* Blog Content */}
                <div className="space-y-10">
                    {blog.sections.map((section, index) => (
                        <section key={index}>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                                {section.heading}
                            </h2>

                            <p className="text-gray-700 leading-8 text-lg">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>




                {/* CTA */}
                <div className="mt-16 bg-green-50 border border-green-100 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Order Medicines Online with MedicoBharat
                    </h3>

                    <p className="text-gray-600 mb-5">
                        Get medicines delivered to your doorstep across {city} and nearby areas..
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href={`/medicine-delivery/${city}`}
                            className="inline-flex items-center px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
                        >
                            Order Now
                        </Link>

                        {/* The lab section's only inbound link from an article.
                            Rendered only when a lab city with THIS slug exists,
                            so it can never 404 on a town we do not serve — the
                            check is the whole reason `labCity` is looked up
                            above rather than the href being built blind. */}
                        {labCity && (
                            <Link
                                href={`/lab-test/${labCity.slug}`}
                                className="inline-flex items-center px-6 py-3 rounded-xl border border-green-600 text-green-700 font-medium hover:bg-green-100 transition"
                            >
                                Book Lab Test in {labCity.name}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mt-16">
                    <h3 className="text-2xl font-bold mb-6">
                        Related Articles
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        {relatedBlogs.map((item) => (
                            <Link
                                key={`${item.category}-${item.city}`}
                                href={`/blogs/${item.category}/${item.city}`}
                                className="border rounded-lg p-4 hover:bg-gray-50"
                            >
                                <h4 className="font-semibold">
                                    {item.title}
                                </h4>

                                <p className="text-sm text-gray-600 mt-2">
                                    {item.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>


                {blog.faqs?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold mb-8">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-6">
                            {blog.faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border rounded-xl p-5"
                                >
                                    <h3 className="font-semibold text-lg mb-2">
                                        {faq.question}
                                    </h3>

                                    <p className="text-gray-600">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </article>
        </>
    );
}
