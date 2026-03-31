---
title: "블로그에 이미지 추가하는 방법"
date: "2026-03-31"
description: "마크다운에서 이미지를 삽입하는 방법을 정리합니다."
category: "블로그 가이드"
tags: ["이미지", "마크다운", "가이드"]
---

## 이미지 추가 방법

### 1. 이미지 파일 저장 위치

`public/images/` 폴더에 이미지를 넣으면 됩니다.

```
public/
  images/
    my-photo.png
    screenshot.jpg
```

### 2. 마크다운에서 불러오기

```markdown
![대체 텍스트](/images/my-photo.png)
```

### 3. 실제 사용 예시

아래처럼 쓰면 이미지가 표시됩니다:

![예시 이미지](/images/example.png)

### 4. 크기 조절이 필요한 경우

HTML 태그를 직접 사용할 수도 있습니다:

```html
<img src="/images/my-photo.png" alt="설명" width="500" />
```

## 정리

| 항목 | 내용 |
|------|------|
| 저장 위치 | `public/images/` |
| 마크다운 문법 | `![설명](/images/파일명)` |
| 지원 포맷 | PNG, JPG, GIF, WebP, SVG |
