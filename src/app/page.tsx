import { getAllPosts } from "@/lib/posts";
import { learningPaths } from "@/lib/learningPaths";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  const posts = getAllPosts();
  const paths = learningPaths
    .map((path) => ({
      path,
      posts: posts
        .filter((p) => p.category === path.category)
        .sort((a, b) => (a.order || 99) - (b.order || 99))
        .map((p) => ({ slug: p.slug, title: p.title })),
    }))
    .filter(({ posts: p }) => p.length > 0);

  return <HomeContent posts={posts} paths={paths} />;
}
