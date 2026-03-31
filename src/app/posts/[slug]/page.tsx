import { getAllPosts, getPostBySlug, getAdjacentPosts, getRelatedPosts } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import TableOfContents from "@/components/TableOfContents";
import ReadingProgress from "@/components/ReadingProgress";
import CodeCopyButton from "@/components/CodeCopyButton";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return { title: `${post.title} | Study Blog`, description: post.description };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const relatedPosts = getRelatedPosts(slug, post.category);

  return (
    <>
      <ReadingProgress />
      <CodeCopyButton />
      <div className="lg:flex lg:gap-8">
        {/* Main Content */}
        <article className="lg:flex-1 lg:max-w-3xl">
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm mb-4 inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
              style={{ color: "var(--accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              목록으로
            </Link>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Link
                href={`/categories/${encodeURIComponent(post.category)}`}
                className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--accent)", color: "#fff" }}
              >
                {post.category}
              </Link>
              <time className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {post.date}
              </time>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                · {post.readingTime}분 읽기
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>
              {post.title}
            </h1>
            {post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mobile TOC - only visible on small screens */}
          <div className="lg:hidden">
            <TableOfContents html={post.contentHtml} />
          </div>

          {/* Post Content */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

          {/* Previous/Next Navigation */}
          <nav
            className="mt-12 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {prev ? (
              <Link
                href={`/posts/${prev.slug}`}
                className="p-4 rounded-lg transition-all hover:-translate-y-0.5"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <span className="text-xs block mb-1" style={{ color: "var(--text-secondary)" }}>
                  ← 이전 글
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/posts/${next.slug}`}
                className="p-4 rounded-lg transition-all hover:-translate-y-0.5 text-right"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <span className="text-xs block mb-1" style={{ color: "var(--text-secondary)" }}>
                  다음 글 →
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>
                관련 글
              </h2>
              <div className="flex flex-col gap-3">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/posts/${rp.slug}`}
                    className="p-3 rounded-lg transition-all hover:-translate-y-0.5 flex items-center justify-between"
                    style={{
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card-bg)",
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      {rp.title}
                    </span>
                    <time className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {rp.date}
                    </time>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Desktop Sidebar TOC - only visible on lg+ screens */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="sticky top-20">
            <TableOfContents html={post.contentHtml} />
          </div>
        </aside>
      </div>
    </>
  );
}
