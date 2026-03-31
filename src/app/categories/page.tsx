import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import Link from "next/link";
import { getCategoryColor } from "@/lib/categories";

export const metadata = { title: "카테고리 | Study Blog" };

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
          카테고리
        </h1>
      </div>
      {categories.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>카테고리가 없습니다.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const count = getPostsByCategory(cat).length;
            const color = getCategoryColor(cat);
            return (
              <Link
                key={cat}
                href={`/categories/${encodeURIComponent(cat)}`}
                className="flex items-center justify-between p-4 rounded-lg transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium" style={{ color: "var(--text)" }}>{cat}</span>
                </div>
                <span
                  className="text-sm px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
                >
                  {count}개
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
