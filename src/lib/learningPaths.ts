export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  slugs: string[];
}

export const learningPaths: LearningPath[] = [
  {
    id: "dev-environment",
    title: "개발환경 세팅",
    description: "터미널부터 Node.js, 패키지 매니저까지 개발 시작에 필요한 기초",
    icon: "terminal",
    color: "#22c55e",
    slugs: [
      "shell-and-zshrc",
      "nodejs-and-nvm",
      "nvmrc",
      "package-manager-basics",
      "git-essential-commands",
      "git-clone-and-ci",
    ],
  },
  {
    id: "js-to-framework",
    title: "JavaScript에서 프레임워크까지",
    description: "JS 핵심 개념부터 TypeScript, React, Next.js까지 단계별 학습",
    icon: "code",
    color: "#3b82f6",
    slugs: [
      "javascript-closures",
      "utility-function",
      "typescript-generics",
      "tsconfig-and-nextjs-files",
      "react-hooks-guide",
      "interface-props-prop-drilling",
      "nextjs-setup",
    ],
  },
  {
    id: "build-and-monorepo",
    title: "빌드 & 모노레포",
    description: "빌드 시스템 이해부터 모노레포 구성과 Turborepo 활용까지",
    icon: "package",
    color: "#f59e0b",
    slugs: [
      "what-is-build",
      "npm-workspace",
      "monorepo-basics",
      "turborepo-basics",
    ],
  },
];
