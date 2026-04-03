export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "JavaScript": "#f59e0b",
    "React": "#06b6d4",
    "TypeScript": "#3b82f6",
    "Git": "#f97316",
    "CSS": "#8b5cf6",
    "Node.js": "#22c55e",
    "Next.js": "#171717",
    "DevOps": "#ec4899",
    "회고": "#6366f1",
  };
  return colors[category] || "var(--accent)";
}
