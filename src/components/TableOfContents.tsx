"use client";

import { useMemo } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ html }: { html: string }) {
  const headings = useMemo(() => {
    const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
    const items: TocItem[] = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      const text = match[2].replace(/<[^>]*>/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, "")
        .replace(/\s+/g, "-");
      items.push({ id, text, level: parseInt(match[1]) });
    }
    return items;
  }, [html]);

  if (headings.length === 0) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="toc">
      <p className="toc-title">목차</p>
      {headings.map((h, i) => (
        <a
          key={i}
          onClick={() => scrollTo(h.id)}
          className={h.level === 3 ? "toc-h3 cursor-pointer" : "cursor-pointer"}
        >
          {h.text}
        </a>
      ))}
    </div>
  );
}
