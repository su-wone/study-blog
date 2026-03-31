"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import SearchBar from "./SearchBar";

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
}

export default function HomeContent({ posts }: { posts: Post[] }) {
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
