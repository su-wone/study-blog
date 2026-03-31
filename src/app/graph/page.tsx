import { getAllPosts } from "@/lib/posts";
import GraphView from "@/components/GraphView";
import { buildGraphData } from "@/lib/graph";

export const metadata = {
  title: "그래프 뷰 - Study Blog",
  description: "블로그 포스트 간의 관계를 시각적으로 탐색하세요",
};

export default function GraphPage() {
  const posts = getAllPosts();
  const graphData = buildGraphData(posts);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          그래프 뷰
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          포스트 간의 관계를 시각적으로 탐색하세요. 같은 카테고리와 태그로 연결됩니다.
        </p>
      </div>
      <GraphView data={graphData} />
    </div>
  );
}
