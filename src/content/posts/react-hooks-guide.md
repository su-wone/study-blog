---
title: "React Hooks 핵심 정리"
date: "2026-03-25"
description: "useState, useEffect, useCallback 등 자주 쓰는 React Hooks를 예제와 함께 정리합니다."
category: "React"
tags: ["react", "hooks", "frontend"]
---

## React Hooks란?

Hooks는 함수 컴포넌트에서 **상태 관리**와 **생명주기 기능**을 사용할 수 있게 해주는 함수입니다.

## useState

가장 기본적인 상태 관리 Hook입니다.

```tsx
const [count, setCount] = useState(0);

// 직접 값 설정
setCount(5);

// 이전 상태 기반 업데이트 (권장)
setCount((prev) => prev + 1);
```

> **팁**: 상태 업데이트가 이전 값에 의존할 때는 반드시 콜백 형태를 사용하세요.

## useEffect

사이드 이펙트를 처리하는 Hook입니다.

```tsx
// 마운트 시 1회 실행
useEffect(() => {
  fetchData();
}, []);

// 의존성이 변경될 때마다 실행
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

// 클린업 함수
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

## useCallback & useMemo

### useCallback - 함수 메모이제이션

```tsx
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

### useMemo - 값 메모이제이션

```tsx
const expensiveValue = useMemo(() => {
  return items.filter((item) => item.active);
}, [items]);
```

## useRef

DOM 접근 및 값 유지에 사용합니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

const focusInput = () => {
  inputRef.current?.focus();
};
```

## Hooks 규칙

1. **최상위에서만 호출** — 조건문, 반복문 안에서 사용 금지
2. **React 함수 컴포넌트** 또는 **커스텀 Hook** 안에서만 호출

## 핵심 비교표

| Hook | 용도 | 리렌더링 유발 |
|------|------|:---:|
| useState | 상태 관리 | O |
| useEffect | 사이드 이펙트 | X |
| useCallback | 함수 메모이제이션 | X |
| useMemo | 값 메모이제이션 | X |
| useRef | DOM 접근 / 값 유지 | X |
