"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { GraphNode, GraphEdge, GraphData } from "@/lib/graph";

const CATEGORY_COLORS: Record<string, string> = {
  DevOps: "#f59e0b",
  JavaScript: "#eab308",
  TypeScript: "#3b82f6",
  React: "#06b6d4",
  "Node.js": "#22c55e",
  "블로그 가이드": "#a855f7",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || "#6b7280";
}

export default function GraphView({ data }: { data: GraphData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>(data.edges);
  const animRef = useRef<number>(0);
  const router = useRouter();

  const connectionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    data.nodes.forEach((n) => counts.set(n.id, 0));
    data.edges.forEach((e) => {
      counts.set(e.source, (counts.get(e.source) || 0) + e.weight);
      counts.set(e.target, (counts.get(e.target) || 0) + e.weight);
    });
    return counts;
  }, [data]);

  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [dragging, setDragging] = useState<GraphNode | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const transformRef = useRef(transform);
  const draggingRef = useRef<GraphNode | null>(null);
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const toggleCategory = useCallback((cat: string) => {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  useEffect(() => {
    draggingRef.current = dragging;
  }, [dragging]);

  // Initialize nodes
  useEffect(() => {
    nodesRef.current = data.nodes.map((n) => ({ ...n }));
    edgesRef.current = data.edges;
  }, [data]);

  // Center graph on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setTransform({ x: rect.width / 2 - 400, y: rect.height / 2 - 300, scale: 1 });
  }, []);

  const screenToWorld = useCallback(
    (sx: number, sy: number) => {
      const t = transformRef.current;
      return {
        x: (sx - t.x) / t.scale,
        y: (sy - t.y) / t.scale,
      };
    },
    []
  );

  const findNodeAt = useCallback(
    (wx: number, wy: number): GraphNode | null => {
      const nodes = nodesRef.current;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = n.x - wx;
        const dy = n.y - wy;
        if (dx * dx + dy * dy < 25 * 25) return n;
      }
      return null;
    },
    []
  );

  // Force simulation + render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cooling = 1;

    function simulate() {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      if (nodes.length === 0) return;

      const alpha = 0.3 * cooling;
      if (cooling > 0.002) cooling *= 0.995;

      // Center gravity
      const cx = 400,
        cy = 300;
      for (const node of nodes) {
        node.vx += (cx - node.x) * 0.005 * alpha;
        node.vy += (cy - node.y) * 0.005 * alpha;
      }

      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (600 * alpha) / (dist * dist);
          dx *= force;
          dy *= force;
          a.vx -= dx;
          a.vy -= dy;
          b.vx += dx;
          b.vy += dy;

          // Weak universal attraction to prevent disconnected nodes from flying away
          if (dist > 150) {
            const pullStrength = 0.0002 * alpha * (dist - 150);
            const pdx = (b.x - a.x) / dist;
            const pdy = (b.y - a.y) / dist;
            a.vx += pdx * pullStrength;
            a.vy += pdy * pullStrength;
            b.vx -= pdx * pullStrength;
            b.vy -= pdy * pullStrength;
          }
        }
      }

      // Attraction along edges
      const nodeMap = new Map(nodes.map((n) => [n.id, n]));
      for (const edge of edges) {
        const a = nodeMap.get(edge.source);
        const b = nodeMap.get(edge.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const strength = 0.015 * alpha * edge.weight;
        const fx = dx * strength;
        const fy = dy * strength;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }

      // Apply velocity with damping
      for (const node of nodes) {
        if (draggingRef.current && node.id === draggingRef.current.id) {
          node.vx = 0;
          node.vy = 0;
          continue;
        }
        node.vx *= 0.6;
        node.vy *= 0.6;
        node.x += node.vx;
        node.y += node.vy;
      }
    }

    function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const t = transformRef.current;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const nodeMap = new Map(nodes.map((n) => [n.id, n]));

      const visibleNodes = nodes.filter((n) => !hiddenCategories.has(n.category));
      const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
      const visibleEdges = edges.filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Read CSS variables for theming
      const style = getComputedStyle(document.documentElement);
      const bgColor = style.getPropertyValue("--bg").trim() || "#fafafa";
      const textColor = style.getPropertyValue("--text").trim() || "#1a1a2e";
      const textSecondary = style.getPropertyValue("--text-secondary").trim() || "#6b7280";
      const borderColor = style.getPropertyValue("--border").trim() || "#e5e7eb";

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.scale(t.scale, t.scale);

      // Draw edges
      for (const edge of visibleEdges) {
        const a = nodeMap.get(edge.source);
        const b = nodeMap.get(edge.target);
        if (!a || !b) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);

        const isConnectedToHovered =
          hoveredNode &&
          (edge.source === hoveredNode.id || edge.target === hoveredNode.id);

        if (hoveredNode) {
          if (isConnectedToHovered) {
            ctx.strokeStyle = getCategoryColor(hoveredNode.category);
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.7;
          } else {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = Math.min(edge.weight * 0.5, 2);
            ctx.globalAlpha = 0.06;
          }
        } else {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = Math.min(edge.weight * 0.5, 2);
          ctx.globalAlpha = 0.3 + edge.weight * 0.1;
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Build visible label set
      const visibleLabelIds = new Set<string>();
      if (hoveredNode) {
        visibleLabelIds.add(hoveredNode.id);
        for (const edge of visibleEdges) {
          if (edge.source === hoveredNode.id) visibleLabelIds.add(edge.target);
          if (edge.target === hoveredNode.id) visibleLabelIds.add(edge.source);
        }
      }

      function truncateLabel(label: string): string {
        return label.length > 12 ? label.slice(0, 12) + "..." : label;
      }

      // Draw nodes
      for (const node of visibleNodes) {
        const isHovered = hoveredNode?.id === node.id;
        const isNeighbor = !isHovered && hoveredNode !== null && visibleLabelIds.has(node.id);
        const color = getCategoryColor(node.category);
        const connections = connectionCounts.get(node.id) || 0;
        const baseRadius = 5 + Math.min(connections * 1.2, 10);
        const radius = isHovered ? baseRadius + 3 : baseRadius;

        const isFaded = hoveredNode !== null && !visibleLabelIds.has(node.id);

        // Glow for hovered
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.15;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        if (isFaded) ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = bgColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        if (isFaded) ctx.globalAlpha = 1;

        // Adaptive label logic
        const inVisibleSet = visibleLabelIds.has(node.id);
        const showLabel =
          hoveredNode !== null
            ? inVisibleSet
            : t.scale > 0.8;

        if (showLabel) {
          let labelText: string;
          let fontSize: string;
          let fontWeight: string;
          let fillColor: string;

          if (isHovered) {
            labelText = node.label;
            fontSize = "13px";
            fontWeight = "bold";
            fillColor = textColor;
          } else if (isNeighbor) {
            labelText = node.label;
            fontSize = "11px";
            fontWeight = "normal";
            fillColor = textSecondary;
          } else {
            labelText = truncateLabel(node.label);
            fontSize = "10px";
            fontWeight = "normal";
            fillColor = textSecondary;
          }

          ctx.font = `${fontWeight} ${fontSize} 'Pretendard', sans-serif`;
          ctx.fillStyle = fillColor;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          if (isFaded) ctx.globalAlpha = 0.15;
          ctx.fillText(labelText, node.x, node.y + radius + 4);
          if (isFaded) ctx.globalAlpha = 1;
        }
      }

      ctx.restore();
    }

    function loop() {
      simulate();
      render();
      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [hoveredNode, hiddenCategories]);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const w = screenToWorld(sx, sy);
      const node = findNodeAt(w.x, w.y);

      if (node) {
        setDragging(node);
      } else {
        isPanningRef.current = true;
      }
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    },
    [screenToWorld, findNodeAt]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      if (draggingRef.current) {
        const w = screenToWorld(sx, sy);
        const node = nodesRef.current.find((n) => n.id === draggingRef.current!.id);
        if (node) {
          node.x = w.x;
          node.y = w.y;
        }
      } else if (isPanningRef.current) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      } else {
        const w = screenToWorld(sx, sy);
        const node = findNodeAt(w.x, w.y);
        setHoveredNode(node);
      }
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    },
    [screenToWorld, findNodeAt]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    isPanningRef.current = false;
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (draggingRef.current) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const w = screenToWorld(sx, sy);
      const node = findNodeAt(w.x, w.y);
      if (node) {
        router.push(`/posts/${node.id}`);
      }
    },
    [screenToWorld, findNodeAt, router]
  );

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    setTransform((prev) => {
      const delta = -e.deltaY * 0.001;
      const zoom = Math.exp(delta);
      const newScale = Math.min(Math.max(prev.scale * zoom, 0.3), 3);
      const ratio = newScale / prev.scale;
      return {
        scale: newScale,
        x: sx - (sx - prev.x) * ratio,
        y: sy - (sy - prev.y) * ratio,
      };
    });
  }, []);

  // Build legend from categories
  const categories = Array.from(new Set(data.nodes.map((n) => n.category)));

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "calc(100vh - 200px)" }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{
          cursor: hoveredNode ? "pointer" : dragging ? "grabbing" : "grab",
          border: "1px solid var(--border)",
          background: "var(--bg)",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {/* Legend */}
      <div
        className="absolute top-4 left-4 rounded-lg p-3 text-xs"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <div className="font-semibold mb-2" style={{ color: "var(--text)", fontSize: "0.8rem" }}>
          카테고리
        </div>
        {categories.map((cat) => {
          const isHidden = hiddenCategories.has(cat);
          return (
            <button
              key={cat}
              className="flex items-center gap-2 mb-1 w-full text-left"
              onClick={() => toggleCategory(cat)}
              style={{ opacity: isHidden ? 0.35 : 1 }}
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{
                  background: isHidden ? "var(--border)" : getCategoryColor(cat),
                }}
              />
              <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls hint */}
      <div
        className="absolute bottom-4 right-4 rounded-lg px-3 py-2 text-xs"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        드래그: 이동 · 스크롤: 확대/축소 · 클릭: 포스트 열기
      </div>

      {/* Hovered node tooltip */}
      {hoveredNode && (
        <div
          className="absolute top-4 right-4 rounded-lg p-3 max-w-[220px]"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div className="font-semibold text-sm mb-1" style={{ color: "var(--text)" }}>
            {hoveredNode.label}
          </div>
          <div className="text-xs mb-1" style={{ color: getCategoryColor(hoveredNode.category) }}>
            {hoveredNode.category}
          </div>
          <div className="flex flex-wrap gap-1">
            {hoveredNode.tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  fontSize: "0.65rem",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
