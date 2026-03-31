---
title: "유틸함수(Utility Function)란"
date: "2026-03-20"
description: "여러 곳에서 반복적으로 쓰이는 범용 도우미 함수인 유틸함수의 개념과 활용법을 정리합니다."
category: "JavaScript"
tags: ["유틸함수", "lodash", "기초"]
---

## 유틸함수(Utility Function)란

여러 곳에서 반복적으로 쓰이는 범용 도우미 함수다. 특정 기능에 종속되지 않고, 이곳저곳에서 가져다 쓸 수 있는 독립적인 함수를 말한다.

```javascript
// 날짜 포맷 변환
formatDate("2026-03-20") // → "2026년 3월 20일"

// 숫자에 콤마 추가
formatNumber(1000000) // → "1,000,000"

// 문자열이 비어있는지 확인
isEmpty("") // → true

// 배열에서 중복 제거
removeDuplicates([1, 2, 2, 3]) // → [1, 2, 3]
```

직접 만들면 이런 식이다.

```javascript
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatNumber(num) {
  return num.toLocaleString();
}

function isEmpty(str) {
  return str === "" || str === null || str === undefined;
}
```

## 핵심 특징

- **재사용성** — 한 번 만들어두면 여러 곳에 import하여 사용할 수 있다
- **독립성** — 다른 코드에 의존하지 않고 단독으로 동작한다
- **범용성** — 비즈니스 로직이 없고, 순수한 데이터 가공 처리만 한다

보통 프로젝트에 `utils/` 또는 `helpers/` 폴더를 만들어 모아두고, Monorepo에서는 여러 패키지가 함께 공유하는 구조로 많이 사용한다.

## 유틸함수 라이브러리

직접 만들 수도 있지만, 이미 잘 만들어진 라이브러리를 가져다 쓸 수도 있다.

| 라이브러리 | 용도 | 사이트 |
|-----------|------|--------|
| Lodash | `_.isEmpty()`, `_.uniq()` 등 수백 가지 유틸 함수 모음 | [lodash.com](https://lodash.com) |
| date-fns | 날짜 관련 유틸 모음 | [date-fns.org](https://date-fns.org) |
| dayjs | 경량 날짜 라이브러리 | [day.js.org](https://day.js.org) |
| validator.js | 이메일, URL 형식 검증 등 | [GitHub](https://github.com/validatorjs/validator.js) |

즉 유틸함수는 직접 만들 수도 있고, 남이 만들어준 라이브러리를 가져다 쓸 수도 있다.
