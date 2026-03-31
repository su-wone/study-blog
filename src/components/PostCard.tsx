"use client";

import Link from "next/link";
import { useState } from "react";
import { getCategoryColor } from "@/lib/categories";

interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  readingTime?: number;
}

export default function PostCard({ slug, title, date, description, category, readingTime }: PostCardProps) {
  const [hovered, setHovered] = useState(false);
  const categoryColor = getCategoryColor(category);

  return (
    <article
      className="rounded-lg p-5 duration-200"
      style={{
        backgroundColor: "var(--card-bg)",
        boxShadow: hovered ? "0 8px 25px rgba(0,0,0,0.1)" : "var(--card-shadow)",
        border: `1px solid ${hovered ? categoryColor : "var(--border)"}`,
        transform: hovered ? "translateY(-4px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/posts/${slug}`} className="block">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: categoryColor, color: "#fff" }}
          >
            {category}
          </span>
          <time className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {date}
          </time>
          {readingTime && (
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              · {readingTime}분 읽기
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>
          {title}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      </Link>
    </article>
  );
}
