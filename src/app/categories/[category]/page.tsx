import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({ category: encodeURIComponent(category) }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return { title: `${decoded} | Study Blog` };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const posts = getPostsByCategory(decoded);
  if (posts.length === 0) notFound();

  return (
    <div>
      <Link
        href="/categories"
        className="text-sm mb-4 inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
        style={{ color: "var(--accent)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        카테고리 목록
      </Link>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
          {decoded}
        </h1>
        <span
          className="text-sm px-2.5 py-0.5 rounded-full ml-2"
          style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
        >
          {posts.length}개
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
}
