---
title: "Next.js 설치 순서와 파일 기반 라우팅"
date: "2026-03-23"
description: "Next.js 설치 방법, 파일 기반 라우팅 개념, app 폴더 구조 생성까지의 과정을 정리합니다."
category: "Next.js"
tags: ["nextjs", "설치", "라우팅", "기초"]
---

## Next.js 설치 순서

> `npm install next@latest`에서 `@latest`는 지금 이 순간 가장 최신 버전을 설치한다는 뜻이다.

### 1단계 — apps/web으로 이동 후 Next.js 설치

```bash
cd apps/web
npm install next@latest react@latest react-dom@latest
```

### 2단계 — apps/web/package.json에 scripts 추가

설치 직후에는 scripts가 없다.

```json
{
  "name": "web",
  "version": "1.0.0",
  "dependencies": {
    "next": "^15.x.x",
    "react": "^19.x.x",
    "react-dom": "^19.x.x"
  }
}
```

여기에 scripts를 추가한다.

```json
{
  "name": "web",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "^15.x.x",
    "react": "^19.x.x",
    "react-dom": "^19.x.x"
  }
}
```

### 3단계 — app 폴더 구조 생성

공식 문서에서 Next.js는 `src/app` 폴더 구조를 권장한다. apps/web 폴더에서 실행한다.

```bash
# apps/web 폴더에 있는지 확인
pwd

# src/app 폴더 생성
mkdir -p src/app
```

`-p` 옵션은 **"중간 폴더도 한 번에 만들어줘"** 라는 뜻이다.

```
mkdir src        ← src 먼저 만들고
mkdir src/app    ← app 만들어야 하는데

mkdir -p src/app ← 한 번에 해결!
```

### 4단계 — 개발 서버 실행

```bash
npm run dev
```

처음 실행하면 `tsconfig.json`, `next-env.d.ts` 등 필요한 설정 파일이 자동으로 생성된다.

### 5단계 — layout.tsx, page.tsx 생성

`src/app/` 폴더 안에 `layout.tsx`와 `page.tsx`를 만들면 기본 페이지가 완성된다.

## 파일 기반 라우팅

Next.js는 **폴더/파일 구조가 곧 URL 구조**다. 이것을 파일 기반 라우팅이라고 한다.

```
src/app/page.tsx           → /
src/app/about/page.tsx     → /about
src/app/blog/page.tsx      → /blog
src/app/blog/[slug]/page.tsx → /blog/글제목
```

별도의 라우터 설정 없이 폴더를 만들고 `page.tsx`를 넣으면 자동으로 해당 경로의 페이지가 된다.
