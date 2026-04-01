---
title: "npm workspace로 모노레포 구성하기"
date: "2026-03-21"
description: "npm workspace의 개념, 설정 방법, 그리고 Node.js 설치와 프로젝트 생성의 차이를 정리합니다."
category: "Node.js"
tags: ["npm", "workspace", "monorepo", "기초"]
order: 4
---

## npm workspace란

**여러 프로젝트를 하나의 npm으로 통합 관리하는 기능**이다. workspace는 직역하면 "작업 공간"으로, 여러 프로젝트가 하나의 작업 공간 안에서 함께 관리된다는 뜻이다.

## 없을 때와 있을 때 비교

**workspace 없이 각각 관리:**

```
apps/web/    → 여기서 따로 npm install
apps/api/    → 여기서 따로 npm install
packages/ui/ → 여기서 따로 npm install

각자 node_modules 가짐 → 중복 설치 → 용량 낭비
```

**workspace 있으면:**

```
루트에서 npm install 한 번
        ↓
apps/web, apps/api, packages/ui
모두 한 번에 설치 + 루트 node_modules에서 통합 관리
```

## workspace가 해주는 것

```
1. 패키지 통합 관리
   루트 node_modules에서 모든 프로젝트 패키지 관리

2. 중복 설치 방지
   react가 여러 프로젝트에서 필요해도 한 번만 설치

3. 내부 패키지 공유
   packages/ui를 apps/web에서 바로 import 가능

4. 루트에서 한 번에 설치
   npm install 한 번으로 전체 프로젝트 의존성 설치
```

## Node.js 설치 vs 프로젝트 생성은 별개다

```
Node.js 설치  →  JavaScript 실행 환경 생김 + npm 사용 가능
                  (package.json은 아직 없음)

npm init      →  그 다음에 이 명령어를 쳐야 package.json이 생김
```

Node.js는 "JavaScript를 실행할 수 있는 환경"을 설치하는 거고, package.json은 프로젝트를 시작할 때 따로 만들어야 한다.

## npm workspace 만드는 법

### 1단계: 폴더 구조 만들기

```
내 모노레포/
├── apps/
│   ├── 웹앱/
│   └── 모바일앱/
└── packages/
    └── 공통UI/
```

### 2단계: 루트에 package.json 만들기

```bash
npm init -y   # 루트 폴더에서 실행
```

`-y`는 "기본값으로 전부 yes 해라"라는 뜻의 줄임말이다.

> **init이란?** "이 폴더를 패키지 도구가 관리하는 프로젝트로 초기화한다"는 뜻이다. 초기화 후에 패키지 관련 명령어 사용이 가능해진다.

### 3단계: 루트 package.json에 workspaces 추가

package.json 파일을 열어서 `private`과 `workspaces`를 추가한다.

```json
{
  "name": "내-프로젝트",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### private: true가 필요한 이유

workspaces 기능은 `private: true`가 없으면 작동하지 않는다. npm이 "이건 외부에 배포할 패키지가 아니라 모노레포구나"라고 인식하게 해주는 설정이다.

## 설정 방법 요약

루트 `package.json`에 이렇게 적으면 된다.

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

`apps/*`는 apps 폴더 안에 있는 모든 프로젝트, `packages/*`는 packages 폴더 안에 있는 모든 패키지를 workspace로 등록한다는 뜻이다.
