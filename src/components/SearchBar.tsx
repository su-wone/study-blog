"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative mb-6">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-secondary)"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="글 검색..."
        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      />
    </div>
  );
}
