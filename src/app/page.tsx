import { getAllPosts } from "@/lib/posts";
import { learningPaths } from "@/lib/learningPaths";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  const posts = getAllPosts();
  const postMap = new Map(posts.map((p) => [p.slug, p]));

  const paths = learningPaths.map((path) => ({
    path,
    posts: path.slugs
      .filter((slug) => postMap.has(slug))
      .map((slug) => {
        const post = postMap.get(slug)!;
        return { slug: post.slug, title: post.title };
      }),
  }));

  return <HomeContent posts={posts} paths={paths} />;
}
