---
title: "tsconfig.json이란? Next.js가 자동 생성하는 파일들"
date: "2026-03-23"
description: "TypeScript 설정 파일 tsconfig.json의 역할과 Next.js 개발 서버 실행 시 생성되는 파일들을 정리합니다."
category: "TypeScript"
tags: ["typescript", "tsconfig", "nextjs", "기초"]
order: 2
---

## tsconfig.json이란

**TypeScript 설정 파일**이다. TypeScript를 어떻게 사용할지 규칙을 정해두는 파일이다.

## TypeScript란

```
JavaScript  →  그냥 코드 작성
TypeScript  →  타입(자료형)을 명시해서 오류를 미리 잡아주는 것
```

예시:

```javascript
// JavaScript - 오류를 나중에 발견
function add(a, b) {
  return a + b
}
add("hello", 1)  // "hello1" 나옴 → 오류인데 실행됨
```

```typescript
// TypeScript - 오류를 미리 발견
function add(a: number, b: number) {
  return a + b
}
add("hello", 1)  // ← 바로 빨간 줄! "hello는 숫자가 아니에요"
```

## Next.js에서 TypeScript

공식 문서에서는:

> "Next.js에는 TypeScript가 내장되어 있어 `next dev`를 실행하면 tsconfig.json을 자동으로 생성해줍니다."

직접 만들 필요 없이 `npm run dev`를 실행하면 Next.js가 알아서 만들어준다.

## npm run dev 실행 시 생성되는 파일들

### 1. .next/ 폴더

```
apps/web/
└── .next/
    ├── cache/      ← 빌드 캐시 저장
    ├── server/     ← 서버 관련 파일
    └── types/      ← 타입 파일
```

개발 서버가 실행될 때 Next.js가 코드를 변환해서 저장하는 폴더다.

```
layout.tsx (우리가 작성한 코드)
        ↓
Next.js가 브라우저가 읽을 수 있게 변환
        ↓
.next/ 폴더에 저장
        ↓
브라우저에 전달
```

이 폴더는 `.gitignore`에 추가해야 한다. 용량이 크고 자동 생성되는 파일이기 때문이다.

### 2. tsconfig.json

```
apps/web/tsconfig.json
```

Next.js가 TypeScript 설정을 자동으로 만들어준 파일이다.

### 3. next-env.d.ts

```
apps/web/next-env.d.ts
```

Next.js 타입 정의 파일이다. TypeScript가 Next.js 전용 기능들을 인식할 수 있게 해준다.

```typescript
// 예를 들어 이런 것들을 TypeScript가 인식하게 해줌
import Image from 'next/image'   // Next.js 이미지 컴포넌트
import Link from 'next/link'     // Next.js 링크 컴포넌트
```

### 4. yarn.lock (잘못 생성된 경우)

Next.js가 TypeScript 패키지를 설치할 때 yarn을 자동으로 사용해서 생기는 파일이다.

```
npm run dev 실행
        ↓
Next.js: "TypeScript 패키지가 없네, 설치해야겠다"
        ↓
yarn으로 자동 설치 (의도와 다름)
        ↓
yarn.lock 생성
```

## .gitignore에 추가해야 할 것들

```
# .gitignore
node_modules/
.turbo/
.next/
next-env.d.ts
dist/
.env
*.log
.DS_Store
```
