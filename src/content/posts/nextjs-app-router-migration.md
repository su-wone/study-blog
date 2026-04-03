---
title: "Next.js App Router 전환기 — Pages Router에서 App Router로, 무엇이 달라졌는가"
date: "2026-04-01"
description: "Next.js Pages Router의 3가지 한계와 App Router가 해결하는 방식을 실제 프로젝트 경험을 바탕으로 정리합니다."
category: "회고"
tags: ["nextjs", "app-router", "react", "ssr", "rsc"]
---

## TL;DR

Next.js 13 이후 도입된 App Router는 단순한 폴더 구조 변화가 아니다. **데이터 페치 방식, 렌더링 전략, 레이아웃 설계** 전반을 다시 생각하게 만드는 패러다임 전환이다. 이 글에서는 실제 프로젝트(NEWNDY)에서 App Router를 적용하면서 체감한 **Pages Router 대비 핵심 차이점 3가지**를 정리한다.

## 배경: Pages Router는 어떤 구조였나

Next.js 초기부터 v12까지 사용된 **Pages Router**는 파일 이름이 곧 URL 경로가 되는 직관적인 방식이었다.

```jsx
// Pages Router 폴더 구조
pages/
├── index.js        →  localhost:3000/
├── about.js        →  localhost:3000/about
├── blog/
│   └── index.js    →  localhost:3000/blog
└── _app.js         ←  모든 페이지의 공통 설정
```

직관적이지만, **프로덕션 규모에서는 3가지 한계**가 드러났다.

## Pages Router의 3가지 한계

### 한계 1 — 데이터 페치 방식의 복잡성

Pages Router에서는 서버 데이터를 가져오려면 `getServerSideProps`라는 전용 함수를 사용해야 했다. 데이터를 `props`로 넘겨줘야 하는 간접적인 구조로, 코드가 불필요하게 길어졌다.

```jsx
// Pages Router — 데이터 페치가 props를 거쳐간다
export async function getServerSideProps() {
  const data = await fetch('https://api.example.com/data')
  return { props: { data } }   // props로 넘겨줘야 했음
}
```

```jsx
// App Router — 직접 사용할 수 있다
async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>      // 바로 사용
}
```

**실무에서의 체감**: NEWNDY 프로젝트에서 메모 목록을 불러올 때, App Router 덕분에 컴포넌트 내부에서 직접 `fetch`를 호출할 수 있어 코드가 훨씬 간결해졌다.

### 한계 2 — 서버 컴포넌트의 부재

Pages Router에서는 **모든 컴포넌트가 브라우저에서 실행**되었다. 즉, 사용자 측에 불필요한 JavaScript까지 전달되며 초기 로딩이 느려졌다.

App Router는 **React Server Components(RSC)**를 도입했다. 서버에서 실행되는 컴포넌트는 JS 번들에 포함되지 않아 **클라이언트로 전송되는 JS 양이 줄어든다**.

```
Pages Router:
  모든 컴포넌트 → 브라우저에서 실행
  → 불필요한 JS가 사용자에게 전달됨
  → 느린 로딩

App Router:
  서버 컴포넌트 → 서버에서만 실행, JS를 브라우저에 안 보냄
  → 빠른 로딩
```

**핵심 포인트**: App Router에서는 기본적으로 모든 컴포넌트가 Server Component이다. 클라이언트 상호작용(`useState`, `onClick` 등)이 필요한 경우에만 `'use client'`를 명시한다.

### 한계 3 — 레이아웃 중첩의 어려움

Pages Router에서는 `_app.js` 하나로만 공통 레이아웃을 관리했다. 페이지마다 다른 레이아웃을 적용하려면 복잡한 조건분기가 필요했다.

App Router에서는 **폴더마다 `layout.tsx`를 둘 수 있어** 중첩 레이아웃이 자연스럽다.

```jsx
// App Router — 폴더별 레이아웃 중첩
app/
├── layout.tsx          ←  전체 공통 레이아웃 (네비게이션, 푸터)
├── dashboard/
│   ├── layout.tsx      ←  대시보드만의 사이드바
│   └── page.tsx
└── blog/
    ├── layout.tsx      ←  블로그만의 레이아웃
    └── page.tsx
```

**실무에서의 체감**: NEWNDY에서 대시보드와 블로그 섹션의 레이아웃을 분리할 때, 폴더 구조만으로 레이아웃을 자연스럽게 구성할 수 있어 코드의 복잡도가 크게 낮아졌다.

## 정리: Pages Router vs App Router 비교

| 항목 | Pages Router | App Router |
|---|---|---|
| **라우팅** | `pages/` 폴더 기반 | `app/` 폴더 기반 |
| **데이터 페치** | `getServerSideProps` 등 전용 함수 | 컴포넌트 내 직접 `async/await` |
| **렌더링** | 전체 클라이언트 렌더링 | 서버/클라이언트 컴포넌트 분리 |
| **레이아웃** | `_app.js` 하나로 관리 | 폴더별 `layout.tsx` 중첩 가능 |
| **번들 크기** | 큰 JS 번들 | RSC로 적은 JS 전송 |

## 회고: 전환하면서 배운 것

App Router로 전환하면서 가장 크게 배운 점은 **"서버와 클라이언트의 경계를 의식적으로 설계해야 한다"**는 것이다.

Pages Router에서는 모든 컴포넌트가 동일한 환경에서 실행되었기 때문에, 이 경계를 고민할 필요가 없었다. 하지만 App Router에서는:

- `useState`, `useEffect` 같은 훅은 **클라이언트 컴포넌트에서만** 사용 가능
- DB 접근, 민감한 API 호출은 **서버 컴포넌트에서** 처리
- 이 구분을 통해 **보안성과 성능을 동시에 개선**

이러한 설계 사고는 단순히 Next.js에만 국한되지 않고, 서버-클라이언트 아키텍처 전반에 적용되는 핵심 능력이라고 생각한다.

## 참고 자료

- [Next.js 공식 문서 — App Router](https://nextjs.org/docs/app)
- [Next.js 공식 문서 — Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
- NEWNDY 프로젝트 실제 적용 경험
