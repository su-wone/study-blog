---
title: "Turborepo 등장 배경과 turbo.json 완벽 정리"
date: "2026-03-31"
description: "Monorepo의 CI 속도, 설정 복잡함, 빌드 순서, 캐시 공유 문제를 Turborepo가 어떻게 해결하는지 정리합니다."
category: "DevOps"
tags: ["turborepo", "monorepo", "빌드", "CI"]
---

## Turborepo 등장 배경

Turborepo는 Monorepo 환경에서 겪는 여러 문제를 해결하기 위해 등장했다.

### 문제 1 : CI 속도

Monorepo에서는 코드 하나만 바꿔도 전체를 다시 빌드했다.

```
유틸함수 파일 하나 수정
    ↓
웹앱 전체 빌드 (5분)
모바일앱 전체 빌드 (5분)
공통UI 전체 빌드 (3분)
    ↓
총 13분 낭비
```

하지만 Turborepo의 기본 원칙은 **"한 번 수행한 작업은 다시 수행하지 않는다"**. 이미 빌드된 내용은 캐시해두고, 변경된 파일만 다시 빌드한다.

```
유틸함수 파일 하나 수정
    ↓
유틸함수만 빌드 (30초)
웹앱, 모바일앱은 캐시에서 가져옴
    ↓
총 30초
```

### 문제 2 : 도구 설정의 복잡함

고급 빌드 시스템을 구축하는 과정을 Turborepo가 대신해주기 때문에, 개발자는 복잡한 설정과 스크립트에 신경 쓰는 대신 개발에 집중할 수 있다.

공통 설정을 `packages` 폴더에 한 번만 만들고, 각 프로젝트가 가져다 쓰는 구조다.

```
내 모노레포/
├── apps/
│   ├── web/
│   │   └── tsconfig.json  ← 공통 설정 extends만 함
│   └── api/
│       └── tsconfig.json  ← 공통 설정 extends만 함
└── packages/
    ├── eslint-config/     ← ESLint 공통 설정 (여기 한 번만)
    └── tsconfig/          ← TypeScript 공통 설정 (여기 한 번만)
```

각 프로젝트는 가져다 쓰기만 하면 된다.

```json
// apps/web/tsconfig.json
{
  "extends": "@내프로젝트/tsconfig/base.json",
  "compilerOptions": {
    "jsx": "react"
  }
}

// apps/api/tsconfig.json
{
  "extends": "@내프로젝트/tsconfig/base.json",
  "compilerOptions": {
    "module": "commonjs"
  }
}
```

공통 TypeScript 설정은 한 번만 작성하면 된다.

```json
// packages/tsconfig/base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 문제 3 : 빌드 순서 관리

```
기존:
개발자가 직접 순서를 짜야 함
"공통UI 먼저 빌드하고, 그 다음 웹앱 빌드해야 하는데..."

Turborepo:
의존 관계를 자동으로 파악해서 순서를 알아서 맞춰줌
```

### 문제 4 : 팀원 간 캐시 공유 불가

```
기존:
내가 빌드한 결과물을 팀원은 모름
팀원도 처음부터 다시 빌드해야 함

Turborepo (클라우드 캐싱):
내가 빌드한 결과물을 클라우드에 올려둠
팀원이 같은 코드 빌드할 때 클라우드에서 가져옴 → 즉시 완료
```

## turbo.json이 하는 일

Turborepo에게 **어떤 작업을 어떤 순서로 실행할지 알려주는 설정 파일**이다.

### 1. tasks — 작업 등록

```json
{
  "tasks": {
    "build": {},
    "dev": {},
    "lint": {}
  }
}
```

`tasks` 안에 등록된 이름으로 각 프로젝트의 `package.json` scripts에서 찾아서 실행한다.

### 2. dependsOn — 실행 순서

`dependsOn`은 이 작업을 실행하기 전에 먼저 완료돼야 하는 작업을 뜻한다.

**`^` (캐럿) 기호가 핵심이다.**

`^`는 **내가 의존하고 있는 패키지들**을 가리킨다.

```json
"build": {
  "dependsOn": ["^build"]
}
```

`^`는 **"의존하는 패키지를 먼저 실행해줘"** 라는 뜻이다.

```
공통UI (라이브러리)
    ↑ 의존
web (애플리케이션)

turbo run build 실행하면:
1. 공통UI build 먼저 실행
2. 완료되면 web build 실행
```

`^` 없이 쓰면 의미가 달라진다.

```json
"test": {
  "dependsOn": ["build"]
}
```

이건 **"같은 패키지 안에서 build 먼저 실행해줘"** 라는 뜻이다.

```
web 패키지 안에서:
1. web build 먼저 실행
2. 완료되면 web test 실행
```

### 3. outputs — 캐시 저장 위치

```json
"build": {
  "outputs": [".next/**", "!.next/cache/**", "dist/**"]
}
```

빌드 결과물이 어느 폴더에 생기는지 알려주는 설정이다.

```
.next/**           ← Next.js 빌드 결과물 폴더
!.next/cache/**    ← ! = 이건 제외 (캐시 폴더는 저장 안 함)
dist/**            ← 일반 빌드 결과물 폴더
```

이 설정이 없으면 Turborepo가 어디를 캐시해야 할지 몰라서 캐싱이 동작하지 않는다.

### 4. cache: false — 캐시 끄기

```json
"dev": {
  "cache": false
}
```

개발 서버는 매번 새로 실행해야 해서 캐시를 끄는 것이다.

```
build → 결과물이 항상 같음 → 캐시 O
dev   → 실시간으로 변함   → 캐시 X
```

### 5. persistent: true — 계속 실행되는 작업

```json
"dev": {
  "persistent": true
}
```

개발 서버처럼 종료되지 않고 계속 켜져있는 작업이라고 알려주는 설정이다.

```
build → 끝나면 종료됨       → persistent 불필요
dev   → 계속 켜져 있어야 함 → persistent: true
```

### 6. 특정 패키지의 특정 작업 지정

```json
"lint": {
  "dependsOn": ["utils#build"]
}

"web#lint": {
  "dependsOn": ["utils#build"]
}
```

`패키지명#작업명` 형식으로 더 세밀하게 순서를 지정할 수 있다.

## turbo.json 최종 정리

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

이 설정이 하는 일을 정리하면:

```
build → 의존 패키지 먼저 빌드 + 결과물 캐시 저장
dev   → 캐시 없이 + 계속 실행
lint  → 의존 패키지 먼저 lint
```

## packages 폴더란?

여러 프로젝트가 공통으로 사용하는 코드를 모아두는 폴더다.

```
apps/     ← 실제 애플리케이션 (web, api 등)
packages/ ← 공통으로 쓰는 코드 (공통UI, 유틸함수, 설정 등)
```
