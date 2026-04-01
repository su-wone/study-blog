"use client";

import Link from "next/link";
import { useState } from "react";

interface PostInfo {
  slug: string;
  title: string;
}

interface LearningPathCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  posts: PostInfo[];
}

function PathIcon({ icon, color }: { icon: string; color: string }) {
  if (icon === "terminal") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    );
  }
  if (icon === "code") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  // package
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

export default function LearningPathCard({ title, description, icon, color, posts }: LearningPathCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-lg p-4 duration-200"
      style={{
        backgroundColor: "var(--card-bg)",
        boxShadow: hovered ? "0 8px 25px rgba(0,0,0,0.1)" : "var(--card-shadow)",
        border: `1px solid ${hovered ? color : "var(--border)"}`,
        transform: hovered ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <PathIcon icon={icon} color={color} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            {title}
          </h3>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {posts.length}개의 글
          </p>
        </div>
      </div>

      <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>

      {/* Post list */}
      <div className="space-y-0.5">
        {(expanded ? posts : posts.slice(0, 3)).map((post, i) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="flex items-center gap-2 py-1.5 px-2 rounded-md text-xs hover:opacity-80 transition-opacity"
            style={{ backgroundColor: i % 2 === 0 ? "transparent" : "var(--bg-secondary)" }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{
                backgroundColor: `${color}20`,
                color: color,
                fontSize: "0.65rem",
              }}
            >
              {i + 1}
            </span>
            <span className="truncate" style={{ color: "var(--text)" }}>
              {post.title}
            </span>
          </Link>
        ))}
      </div>

      {posts.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs font-medium w-full text-center py-1 rounded"
          style={{ color: color }}
        >
          {expanded ? "접기" : `+ ${posts.length - 3}개 더 보기`}
        </button>
      )}
    </div>
  );
}
