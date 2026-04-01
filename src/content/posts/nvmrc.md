---
title: ".nvmrc란? Node.js 버전 고정하기"
date: "2026-03-23"
description: "프로젝트에서 사용할 Node.js 버전을 .nvmrc 파일로 명시하고 적용하는 방법을 정리합니다."
category: "Node.js"
tags: ["nvm", "nodejs", "설정", "기초"]
order: 2
---

## .nvmrc란

**"이 프로젝트는 이 버전의 Node.js를 사용해야 해"라고 명시하는 파일**이다.

## .nvmrc 만들고 적용하는 전체 순서

### 1단계 — 파일 생성

```bash
echo "24.7.0" > .nvmrc
```

이 명령어가 하는 일:

```
echo "24.7.0"  →  "24.7.0"이라는 텍스트를
>              →  아래 파일에 저장해줘
.nvmrc         →  .nvmrc 파일에
```

### 2단계 — 해당 버전 설치 및 적용

```bash
nvm install    # .nvmrc에 적힌 버전을 설치
nvm use        # .nvmrc에 적힌 버전으로 전환
node -v        # 버전 확인
```

`.nvmrc` 파일이 있는 폴더에서 `nvm install`이나 `nvm use`를 실행하면 자동으로 파일에 적힌 버전을 읽어서 적용한다.
