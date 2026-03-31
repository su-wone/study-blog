---
title: "JavaScript 클로저(Closure) 완벽 이해"
date: "2026-03-28"
description: "클로저의 개념, 동작 원리, 실용적인 활용 패턴까지 정리합니다."
category: "JavaScript"
tags: ["javascript", "closure", "함수형프로그래밍"]
---

## 클로저란?

클로저(Closure)는 **함수와 그 함수가 선언된 렉시컬 환경의 조합**입니다. 내부 함수가 외부 함수의 변수에 접근할 수 있는 것이 핵심입니다.

```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
```

## 왜 중요한가?

1. **데이터 은닉**: 외부에서 직접 접근할 수 없는 private 변수를 만들 수 있습니다.
2. **상태 유지**: 함수 호출 사이에 상태를 유지할 수 있습니다.
3. **모듈 패턴**: 클로저를 활용해 모듈 패턴을 구현할 수 있습니다.

## 실용적인 예시

### 이벤트 핸들러

```javascript
function createHandler(message) {
  return function () {
    console.log(message);
  };
}

const handler = createHandler("버튼이 클릭되었습니다!");
button.addEventListener("click", handler);
```

### 커링 (Currying)

```javascript
function multiply(a) {
  return function (b) {
    return a * b;
  };
}

const double = multiply(2);
console.log(double(5)); // 10
console.log(double(3)); // 6
```

## 주의사항

- 클로저는 외부 변수에 대한 **참조**를 유지합니다 (값의 복사가 아님)
- 루프에서 `var`를 사용할 때 클로저 관련 버그에 주의하세요
- 불필요한 클로저는 메모리 누수의 원인이 될 수 있습니다

## 핵심 정리

| 개념 | 설명 |
|------|------|
| 렉시컬 스코프 | 함수가 정의된 위치에 따라 스코프 결정 |
| 클로저 | 함수 + 렉시컬 환경 |
| 활용 | 데이터 은닉, 상태 유지, 커링 |
