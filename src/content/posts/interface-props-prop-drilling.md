---
title: "interface와 props, 그리고 prop drilling"
date: "2026-04-01"
description: "TypeScript의 interface로 props 명세를 작성하는 법, 컴포넌트가 props를 받는 구조, prop drilling 문제와 Zustand 해결책을 정리합니다."
category: "React"
tags: ["typescript", "react", "interface", "props", "prop-drilling", "기초"]
order: 2
---

## interface란

**"이 컴포넌트에 뭘 넘겨줘야 하는지 적어놓은 명세서(주문서)"**다.

### 식당 비유

```
┌─ 주문서 (interface) ──────┐
│  메뉴: 문자열              │  ← 반드시 채워야 함
│  수량: 숫자                │  ← 반드시 채워야 함
│  포장여부: true/false      │  ← 반드시 채워야 함
└────────────────────────────┘
```

### 실제 코드

```tsx
interface MemoListProps {
  memos: Memo[];                  // 메모 배열을 넘겨줘야 함
  onEdit: (memo: Memo) => void;   // 수정 함수를 넘겨줘야 함
  onDelete: (memo: Memo) => void; // 삭제 함수를 넘겨줘야 함
}
```

### 안 지키면?

```tsx
// ❌ 빠뜨리면 → 에러
<MemoList memos={memos} onEdit={onEditMemo} />
// "onDelete가 빠졌습니다!"

// ❌ 타입이 다르면 → 에러
<MemoList memos={memos} onEdit={onEditMemo} onDelete={123} />
// "onDelete는 함수여야 합니다!"

// ✅ 명세서대로 다 넘기면 → 정상
<MemoList memos={memos} onEdit={onEditMemo} onDelete={onDeleteMemo} />
```

## 컴포넌트 구조

컴포넌트는 **props를 받아서 JSX(화면)를 반환하는 함수**다.

```tsx
export default function MemoList({ memos, onEdit, onDelete }: MemoListProps) {
//  ① 함수 선언 + 이름        ② props 받기(구조 분해)    ③ 명세서(interface)
  return (
    // ④ 화면에 그릴 내용 (JSX)
  )
}
```

### 구조 분해 할당이란?

```tsx
// 이렇게 쓰는 대신
function MemoList(props: MemoListProps) {
  props.memos    // 매번 props. 붙여야 함
  props.onEdit
}

// 이렇게 꺼내서 바로 쓸 수 있음
function MemoList({ memos, onEdit }: MemoListProps) {
  memos          // 바로 사용 가능
  onEdit
}
```

## prop drilling이란

하위 컴포넌트에서 쓸 props를 **중간 컴포넌트들이 쓰지도 않으면서** 받아서 넘겨야 하는 문제다.

### 실제 흐름 (onEditMemo 예시)

```
┌─ page.tsx ──────────────────────────────────────────┐
│ const [editingMemo, setEditingMemo] = useState(null)│
│ <BoardTemplate onEditMemo={setEditingMemo} /> ← 전달│
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─ BoardTemplate.tsx ─────────────────────────────────┐
│ interface { onEditMemo: ... }  ← 선언 (안 씀)      │
│ <MemoList onEdit={onEditMemo} />   ← 그대로 넘김   │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─ MemoList.tsx ──────────────────────────────────────┐
│ interface { onEdit: ... }      ← 선언 (안 씀)      │
│ <MemoItem onEdit={onEdit} />       ← 그대로 넘김   │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─ MemoItem.tsx ──────────────────────────────────────┐
│ interface { onEdit: ... }      ← 선언              │
│ <Button onClick={() => onEdit(memo)}>  ← 드디어 사용│
└─────────────────────────────────────────────────────┘
```

### 핵심 문제 2가지

1. **중간 컴포넌트가 안 쓰는 props를 받아서 넘기기만 해야 함**
2. **같은 타입의 interface 선언이 경로상 모든 파일에 중복됨**

### 기능 추가 시 비용

pinMemo 기능을 추가한다면:

```
수정해야 하는 파일:
  ✏️ page.tsx              ← 함수 정의
  ✏️ BoardTemplateProps    ← interface 추가 (안 쓰는데)
  ✏️ BoardTemplate.tsx     ← 받아서 넘기기 (안 쓰는데)
  ✏️ MemoListProps         ← interface 추가 (안 쓰는데)
  ✏️ MemoList.tsx          ← 받아서 넘기기 (안 쓰는데)
  ✏️ MemoItemProps         ← interface 추가
  ✏️ MemoItem.tsx          ← 여기서 드디어 사용
→ 실제 로직은 2곳인데 7곳을 수정해야 함
```

## 해결책: 전역 상태관리 (Zustand)

```tsx
// store 정의 (한 곳)
const useMemoStore = create((set) => ({
  memos: [],
  editingMemo: null,
  setEditingMemo: (memo) => set({ editingMemo: memo }),
}))

// 어떤 깊이의 컴포넌트에서든 바로 접근
function MemoItem() {
  const setEditingMemo = useMemoStore((s) => s.setEditingMemo)
  // 중간 컴포넌트를 거칠 필요 없음!
}
```

prop drilling 방식과 비교:

```
// prop drilling
page.tsx → BoardTemplate → MemoList → MemoItem

// 전역 상태관리
page.tsx (저장) ─────────────────────→ MemoItem (바로 꺼내 씀)
```

중간 컴포넌트들이 불필요하게 props를 전달할 필요가 없어진다.
