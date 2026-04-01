"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import SearchBar from "./SearchBar";
import LearningPathCard from "./LearningPathCard";
import type { LearningPath } from "@/lib/learningPaths";

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
}

interface PathWithPosts {
  path: LearningPath;
  posts: { slug: string; title: string }[];
}

export default function HomeContent({
  posts,
  paths,
}: {
  posts: Post[];
  paths: PathWithPosts[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-8 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
            Study Blog
          </h1>
        </div>
        <p className="text-base mb-1" style={{ color: "var(--text-secondary)" }}>
          공부한 내용을 깔끔하게 정리하는 공간입니다.
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          총 {posts.length}개의 글
        </p>
      </section>

      {/* Learning Paths */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>
          학습 경로
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          어디서부터 읽을지 고민된다면, 경로를 따라 순서대로 읽어보세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paths.map(({ path, posts: pathPosts }) => (
            <LearningPathCard
              key={path.id}
              title={path.title}
              description={path.description}
              icon={path.icon}
              color={path.color}
              posts={pathPosts}
            />
          ))}
        </div>
      </section>

      {/* Search */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Posts */}
      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>
          {searchQuery ? `검색 결과 (${filteredPosts.length})` : "최신 글"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.length === 0 ? (
            <p className="text-sm py-8 text-center col-span-2" style={{ color: "var(--text-secondary)" }}>
              {searchQuery ? "검색 결과가 없습니다." : "아직 작성된 글이 없습니다."}
            </p>
          ) : (
            filteredPosts.map((post) => <PostCard key={post.slug} {...post} />)
          )}
        </div>
      </section>
    </div>
  );
}
