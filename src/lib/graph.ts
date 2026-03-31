export interface GraphNode {
  id: string;
  label: string;
  category: string;
  tags: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function buildGraphData(
  posts: { slug: string; title: string; category: string; tags: string[] }[]
): GraphData {
  const nodes: GraphNode[] = posts.map((p, i) => {
    const angle = (2 * Math.PI * i) / posts.length;
    const radius = 200 + Math.random() * 150;
    return {
      id: p.slug,
      label: p.title,
      category: p.category,
      tags: p.tags,
      x: 400 + Math.cos(angle) * radius,
      y: 300 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
    };
  });

  const edges: GraphEdge[] = [];
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const a = posts[i];
      const b = posts[j];
      let weight = 0;
      if (a.category === b.category) weight += 2;
      const sharedTags = a.tags.filter((t) => b.tags.includes(t));
      weight += sharedTags.length;
      if (weight > 0) {
        edges.push({ source: a.slug, target: b.slug, weight });
      }
    }
  }

  return { nodes, edges };
}
