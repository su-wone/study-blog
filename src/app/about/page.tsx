import { getAllPosts, getAllCategories } from "@/lib/posts";

export const metadata = { title: "소개 | Study Blog" };

export default function AboutPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
          소개
        </h1>
      </div>

      <div
        className="rounded-lg p-6 mb-8"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            S
          </div>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
              Study Blog
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              개발 공부 기록
            </p>
          </div>
        </div>
        <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          이 블로그는 개발 공부 과정에서 배운 내용을 정리하고 공유하기 위해 만들었습니다.
          주로 웹 개발, JavaScript/TypeScript, React 등의 주제를 다룹니다.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div
          className="rounded-lg p-4 text-center"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            {posts.length}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            게시글
          </p>
        </div>
        <div
          className="rounded-lg p-4 text-center"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            {categories.length}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            카테고리
          </p>
        </div>
        <div
          className="rounded-lg p-4 text-center"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            {posts.reduce((acc, p) => acc + p.tags.length, 0)}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            태그
          </p>
        </div>
      </div>

      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>
          기술 스택
        </h2>
        <div className="flex flex-wrap gap-3">
          {["Next.js", "React", "TypeScript", "Tailwind CSS", "Markdown"].map((tech) => (
            <span
              key={tech}
              className="text-sm px-3 py-1 rounded-full"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
