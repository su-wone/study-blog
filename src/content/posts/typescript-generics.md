---
title: "TypeScript 제네릭(Generics) 이해하기"
date: "2026-03-15"
description: "타입 안정성과 재사용성을 동시에 잡는 제네릭의 핵심 개념을 정리합니다."
category: "TypeScript"
tags: ["typescript", "generics", "타입시스템"]
---

## 제네릭이란?

제네릭은 **타입을 매개변수로 받는 문법**입니다. 함수, 인터페이스, 클래스에서 다양한 타입에 대해 재사용 가능한 코드를 작성할 수 있습니다.

```typescript
// 제네릭 없이 - any 사용 (타입 안정성 X)
function getFirst(arr: any[]): any {
  return arr[0];
}

// 제네릭 사용 (타입 안정성 O)
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]); // number로 추론
const str = getFirst(["a", "b"]); // string으로 추론
```

## 제네릭 제약 (Constraints)

`extends` 키워드로 타입 매개변수를 제한할 수 있습니다.

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(value: T): void {
  console.log(value.length);
}

logLength("hello"); // OK - string은 length 있음
logLength([1, 2]); // OK - array는 length 있음
logLength(123); // Error - number는 length 없음
```

## 실용 패턴

### 여러 타입 매개변수

```typescript
function merge<A, B>(obj1: A, obj2: B): A & B {
  return { ...obj1, ...obj2 };
}

const result = merge({ name: "Kim" }, { age: 25 });
// { name: string; age: number }
```

### keyof와 함께 사용

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Kim", age: 25 };
const name = getProperty(user, "name"); // string
const age = getProperty(user, "age"); // number
```

### 제네릭 인터페이스

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

type UserResponse = ApiResponse<{ id: number; name: string }>;
type ListResponse = ApiResponse<string[]>;
```

## 유틸리티 타입 (내장 제네릭)

TypeScript가 기본 제공하는 유용한 제네릭 타입들:

```typescript
// 모든 프로퍼티를 선택적으로
Partial<User>

// 모든 프로퍼티를 필수로
Required<User>

// 특정 프로퍼티만 선택
Pick<User, "name" | "email">

// 특정 프로퍼티 제외
Omit<User, "password">

// 레코드 타입
Record<string, number>
```

## 핵심 정리

| 개념 | 문법 | 용도 |
|------|------|------|
| 기본 제네릭 | `<T>` | 타입 매개변수화 |
| 제약 | `<T extends U>` | 타입 범위 제한 |
| 다중 매개변수 | `<T, U>` | 여러 타입 조합 |
| keyof | `<K extends keyof T>` | 객체 키 제한 |
| 기본값 | `<T = string>` | 기본 타입 지정 |
