import Link from "next/link";
import { blogs } from "@/data/blogData";

export default function BlogsPage() {
  return (
    <div className="pt-35">
      <h1>All Blogs</h1>

      {blogs.map((blog) => (
        <div key={blog.slug}>
          <Link href={`/blogs/${blog.slug}`}>
            {blog.title}
          </Link>
        </div>
      ))}
    </div>
  );
}