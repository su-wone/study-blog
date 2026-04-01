---
title: "Storybook이란? 컴포넌트를 독립적으로 확인하는 도구"
date: "2026-04-01"
description: "Storybook의 역할과 Atomic Design과의 궁합, 언제 도입하면 좋은지 정리합니다."
category: "React"
tags: ["react", "storybook", "컴포넌트", "테스트", "기초"]
order: 3
---

## Storybook이란

앱과 별도의 개발 서버를 띄워서 **컴포넌트를 하나씩 골라 렌더링**하는 도구다.

## 어떻게 동작하는가

1. 각 컴포넌트마다 `.stories.tsx` 파일을 작성한다
2. Storybook 서버를 실행하면 브라우저에 컴포넌트 목록이 나온다
3. 컴포넌트를 선택하고 **props를 실시간으로 바꿔가며** 확인할 수 있다

```tsx
// Button.stories.tsx
import Button from './Button'

export default {
  title: 'Atoms/Button',
  component: Button,
}

export const Primary = {
  args: {
    children: '저장',
    onClick: () => alert('클릭!'),
  },
}

export const Disabled = {
  args: {
    children: '비활성화',
    disabled: true,
  },
}
```

## Atomic Design과 궁합이 좋은 이유

- Atom, Molecule 같은 작은 단위를 **앱 전체를 실행하지 않고** 독립적으로 확인 가능
- 컴포넌트별로 다양한 상태(정상, 에러, 로딩 등)를 미리 확인 가능
- 디자이너와 협업 시 컴포넌트 카탈로그로 활용 가능

## 언제 도입하면 좋은가

- 프로젝트 규모가 작을 때는 불필요
- **컴포넌트가 많아지고 재사용이 빈번해지면** 도입 고려
- 팀 작업 시 컴포넌트 공유 목적으로도 유용
