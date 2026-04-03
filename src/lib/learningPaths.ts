export interface LearningPath {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const learningPaths: LearningPath[] = [
  {
    id: "dev-environment",
    category: "DevOps",
    title: "개발환경 세팅",
    description: "터미널부터 Node.js, 패키지 매니저까지 개발 시작에 필요한 기초",
    icon: "terminal",
    color: "#22c55e",
  },
  {
    id: "js-to-framework",
    category: "JavaScript",
    title: "JavaScript 핵심 개념",
    description: "클로저, 유틸함수 등 JS 핵심 개념 학습",
    icon: "code",
    color: "#f59e0b",
  },
  {
    id: "typescript",
    category: "TypeScript",
    title: "TypeScript 학습",
    description: "타입 시스템, 제네릭, 설정 파일까지 TypeScript 단계별 학습",
    icon: "code",
    color: "#3b82f6",
  },
  {
    id: "react-nextjs",
    category: "React",
    title: "React & Next.js",
    description: "Hooks, Props부터 Next.js 라우팅까지 프론트엔드 프레임워크 학습",
    icon: "code",
    color: "#06b6d4",
  },
  {
    id: "nodejs",
    category: "Node.js",
    title: "Node.js & 패키지 관리",
    description: "Node.js 설치, nvm, 패키지 매니저, workspace 활용",
    icon: "package",
    color: "#22c55e",
  },
  {
    id: "nextjs",
    category: "Next.js",
    title: "Next.js 시작하기",
    description: "Next.js 설치와 파일 기반 라우팅 학습",
    icon: "code",
    color: "#171717",
  },
  {
    id: "retrospective",
    category: "회고",
    title: "프로젝트 회고",
    description: "실제 프로젝트 경험에서 배운 것들을 정리",
    icon: "book",
    color: "#6366f1",
  },
];
