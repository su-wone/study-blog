import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
}

export interface Post extends PostMeta {
  contentHtml: string;
  readingTime: number;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.replace(/[#*`\[\]()>-]/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const files = fs.readdirSync(postsDirectory);
  const posts = files
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        description: data.description || "",
        category: data.category || "미분류",
        tags: data.tags || [],
      };
    });
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const processed = await remark().use(html).process(content);
  const rawHtml = processed.toString();
  const readingTime = calculateReadingTime(content);
  // Add IDs to headings for TOC
  const contentHtml = rawHtml.replace(
    /<h([23])>(.*?)<\/h[23]>/gi,
    (_, level, text) => {
      const id = text
        .replace(/<[^>]*>/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, "")
        .replace(/\s+/g, "-");
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );
  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    description: data.description || "",
    category: data.category || "미분류",
    tags: data.tags || [],
    contentHtml,
    readingTime,
  };
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories).sort();
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export function getRelatedPosts(slug: string, category: string, limit = 3): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug && p.category === category)
    .slice(0, limit);
}
