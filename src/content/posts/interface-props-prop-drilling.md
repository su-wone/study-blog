---
title: "interface와 props, 그리고 prop drilling"
date: "2026-04-01"
description: "TypeScript의 interface로 props 명세를 작성하는 법, 컴포넌트가 props를 받는 구조, 그리고 prop drilling 문제와 해결책을 정리합니다."
category: "React"
tags: ["typescript", "react", "interface", "props", "prop-drilling", "기초"]
---

## interface란

**"이 컴포넌트에 뭘 넘겨줘야 하는지 적어놓은 명세서"**다.

주문서처럼, 적힌 항목을 빠짐없이 채워야 한다. 안 지키면 TypeScript가 에러를 낸다.

```tsx
interface MemoListProps {
  memos: Memo[];
  onEdit: (memo: Memo) => void;
  onDelete: (memo: Memo) => void;
}
```

- `memos` — Memo 배열을 넘겨야 한다
- `onEdit` — Memo를 받아서 실행하는 함수를 넘겨야 한다
- `onDelete` — 마찬가지로 Memo를 받는 함수

하나라도 빠지면 TypeScript가 **"주문서에 적힌 항목이 없다"**고 에러를 낸다.

## 컴포넌트 구조

컴포넌트는 **props를 받아서 JSX를 반환하는 함수**다.

```tsx
export default function MemoList({ memos, onEdit, onDelete }: MemoListProps) {
//  ① 함수 선언 + 이름        ② props 받기              ③ 명세서(interface)
  return ( /* ④ 화면에 그릴 내용 */ )
}
```

`{ memos, onEdit }` 형태는 **구조 분해 할당**이다. `props.memos` 대신 `memos`로 바로 사용할 수 있다.

```tsx
// 구조 분해 할당 안 쓰면
function MemoList(props: MemoListProps) {
  console.log(props.memos);
  console.log(props.onEdit);
}

// 구조 분해 할당 쓰면
function MemoList({ memos, onEdit }: MemoListProps) {
  console.log(memos);
  console.log(onEdit);
}
```

## prop drilling이란

하위 컴포넌트에서 쓸 props를 **중간 컴포넌트들이 쓰지도 않으면서 받아서 넘겨야 하는 문제**다.

```
page.tsx (정의) → BoardTemplate (안 쓰고 넘김) → MemoList (안 쓰고 넘김) → MemoItem (사용!)
```

### 왜 문제인가

- 중간 컴포넌트들도 interface에 해당 props를 선언해야 한다
- 기능 추가 시 경로상 **모든 파일의 interface를 수정**해야 한다
- 컴포넌트가 깊어질수록 유지보수가 어려워진다

### 해결책

**Zustand** 같은 전역 상태관리를 사용하면 어떤 깊이에서든 직접 접근할 수 있다.

```
// prop drilling
page.tsx → BoardTemplate → MemoList → MemoItem

// 전역 상태관리
page.tsx (저장) ─────────────────────→ MemoItem (바로 꺼내 씀)
```

중간 컴포넌트들이 불필요하게 props를 전달할 필요가 없어진다.
