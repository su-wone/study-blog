---
title: "Atomic Design이란? 컴포넌트를 크기별로 나누는 설계 패턴"
date: "2026-04-01"
description: "Atomic Design 패턴의 5단계 구조와 왜 쓰는지, 실제 프로젝트에 적용한 폴더 구조를 정리합니다."
category: "React"
tags: ["react", "atomic-design", "컴포넌트", "설계패턴", "기초"]
order: 1
---

## Atomic Design이란

컴포넌트를 **크기 단위로 5단계**로 나누는 설계 패턴이다.

| 레벨 | 역할 | 비유 | 예시 |
|---|---|---|---|
| **Atom** | 더 이상 쪼갤 수 없는 최소 UI | 레고 블록 1개 | Button, Input, ImageThumbnail, Modal |
| **Molecule** | Atom을 조합한 한 가지 기능 | 레고 블록 몇 개 조합 | ImagePreviewList, ImageUploader |
| **Organism** | 독립적인 UI 섹션 | 완성된 레고 파츠 | MemoForm, MemoItem, EditModal |
| **Template** | 레이아웃 배치만 (데이터 없음) | 빈 액자 틀 | BoardTemplate |
| **Page** | 데이터 + 상태관리 | 액자에 그림 넣기 | page.tsx |

## 왜 쓰는가

- **재사용**: Button 하나로 모든 곳에서 사용 (인라인 중복 제거)
- **유지보수**: 버튼 스타일 바꾸면 Button.tsx 하나만 수정
- **관심사 분리**: page.tsx는 데이터만, 컴포넌트는 UI만

## 실제 적용한 폴더 구조

```
src/components/
├── atoms/           ← 최소 단위
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── ImageThumbnail.tsx
│   └── Modal.tsx
├── molecules/       ← Atom 조합
│   ├── ImagePreviewList.tsx
│   └── ImageUploader.tsx
├── organisms/       ← 독립 UI 블록
│   ├── MemoForm.tsx
│   ├── MemoItem.tsx
│   ├── MemoList.tsx
│   ├── EditModal.tsx
│   └── DeleteModal.tsx
└── templates/       ← 레이아웃
    └── BoardTemplate.tsx
```

## 각 단계 역할 정리

### Atom — 최소 단위

더 이상 쪼갤 수 없는 UI 요소다. 혼자서는 의미 있는 기능을 하지 못한다.

```tsx
// Button.tsx — 어디서든 재사용 가능한 버튼
function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>
}
```

### Molecule — Atom 조합

Atom 여러 개를 조합해서 **한 가지 기능**을 수행한다.

```tsx
// ImageUploader.tsx — Input(Atom) + Button(Atom) 조합
function ImageUploader() {
  return (
    <div>
      <Input type="file" />
      <Button>업로드</Button>
    </div>
  )
}
```

### Organism — 독립 UI 블록

Molecule과 Atom을 조합한 **의미 있는 UI 섹션**이다. 단독으로 기능한다.

```tsx
// MemoForm.tsx — Input + Button + ImageUploader 조합
function MemoForm() {
  return (
    <form>
      <Input placeholder="메모 내용" />
      <ImageUploader />
      <Button>저장</Button>
    </form>
  )
}
```

### Template — 레이아웃

Organism을 **어디에 배치할지**만 결정한다. 데이터는 없다.

```tsx
// BoardTemplate.tsx — 배치만 담당
function BoardTemplate({ memoForm, memoList }) {
  return (
    <div>
      <section>{memoForm}</section>
      <section>{memoList}</section>
    </div>
  )
}
```

### Page — 데이터 연결

Template에 **실제 데이터와 상태관리**를 연결한다.

```tsx
// page.tsx — 데이터 + 상태 + Template
function Page() {
  const [memos, setMemos] = useState([])
  return (
    <BoardTemplate
      memoForm={<MemoForm onSubmit={addMemo} />}
      memoList={<MemoList memos={memos} />}
    />
  )
}
```
