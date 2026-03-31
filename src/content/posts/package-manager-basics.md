---
title: "패키지 매니저 npm, yarn, pnpm 완벽 정리"
date: "2026-03-20"
description: "npm, yarn, pnpm의 차이점과 package.json, 유령 의존성 등 패키지 매니저의 핵심 개념을 정리합니다."
category: "Node.js"
tags: ["npm", "yarn", "pnpm", "패키지매니저", "기초"]
---

## 패키지 매니저(Package Manager)란

외부 라이브러리를 설치하고 관리해주는 도구다. Lodash, date-fns 같은 라이브러리를 직접 사이트에서 다운받으면 번거롭기 때문에, 명령어 한 줄로 설치할 수 있게 해준다.

```bash
npm install lodash    # lodash 설치
npm install date-fns  # date-fns 설치
```

## npm vs yarn vs pnpm

|  | npm | yarn | pnpm |
|--|-----|------|------|
| 출시 | 2010 | 2016 | 2017 |
| 만든 곳 | Node.js 기본 내장 | Facebook | 커뮤니티 |
| 속도 | 보통 | 빠름 | 가장 빠름 |
| 특징 | 가장 기본, 어디서나 씀 | npm 단점 보완 | 디스크 용량 절약 |

npm이 첫 출시했을 때는 속도도 느리고 버그가 많았다. 그래서 Facebook이 이걸 개선한 yarn을 만들었고, 그 이후 디스크 용량 문제까지 해결한 pnpm이 나왔다.

## npm의 문제점

### 속도 문제

npm 초기 버전은 패키지를 순서대로 하나씩 설치했다.

```
lodash 설치 완료 → date-fns 설치 시작 → 완료 → 다음 설치
```

10개를 설치하면 10번을 기다려야 했다. 이것을 직렬 설치라고 한다.

### node_modules 구조 문제

가장 유명한 문제는 node_modules의 중첩 구조다.

```
내 프로젝트/
└── node_modules/
    ├── A 패키지 (lodash 1.0 필요)
    │   └── node_modules/
    │       └── lodash 1.0  ← A용
    └── B 패키지 (lodash 2.0 필요)
        └── node_modules/
            └── lodash 2.0  ← B용
```

- 패키지 안에 또 패키지가 생기는 문제. 이걸 **의존성 지옥(dependency hell)** 이라고 불렀다.
- 같은 프로젝트인데 팀원마다 설치 결과가 달라지는 문제도 있었다.

## yarn이 개선한 것

Facebook에서도 이런 문제를 겪다가 yarn을 발표했다.

### 병렬 처리

여러 패키지를 동시에 설치하도록 바꿨다.

```
lodash 설치 중...
date-fns 설치 중...   ← 동시에!
axios 설치 중...
```

### yarn.lock 도입

설치할 때 yarn.lock 파일을 자동 생성해서, 팀원 누가 설치해도 완전히 동일한 버전이 설치되도록 고정했다. 이후 npm도 이걸 따라서 package-lock.json을 만들었다.

### 오프라인 캐시

한 번 설치한 패키지를 컴퓨터에 저장해두었다가, 다음에 설치할 때 인터넷 없이도 캐시에서 가져오게 했다.

## package.json vs package-lock.json

한 줄 정리:
- **package.json** → "이 정도 버전 써요" (범위 지정)
- **package-lock.json** → "정확히 이 버전을 써라" (버전 고정)

package.json을 보면:

```json
{
  "dependencies": {
    "lodash": "^4.17.0"
  }
}
```

`^4.17.0`은 "4.17.0 이상이면 아무거나 설치해도 돼"라는 뜻이다. 그래서 내가 설치했을 때는 4.17.0인데, 팀원이 한 달 뒤에 설치하면 그 사이 4.18.0이 나와서 다른 버전이 설치될 수 있다.

package-lock.json은 정확한 버전을 기록한다.

```json
{
  "dependencies": {
    "lodash": {
      "version": "4.17.21"
    }
  }
}
```

### 그럼 package.json은 없어도 되는 거 아닌가?

package.json은 버전 관리만 하는 것이 아니다.

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "build": "next build",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0"
  }
}
```

lock 파일에는 이런 정보가 없다. lock 파일은 오직 **어떤 버전을 설치했는가**만 기록한다. 또한 lock 파일은 수천 줄로 되어 있어서 사람이 직접 읽고 수정하려고 만든 파일이 아니다.

반면 package.json은 사람이 직접 읽고 수정하는 파일이다.

## scripts — 명령어 단축키

긴 명령어를 짧게 줄여서 쓸 수 있게 해준다.

```json
"scripts": {
  "start": "node index.js",
  "build": "next build --output=standalone --verbose --optimize",
  "test": "jest --coverage --watchAll"
}
```

build처럼 실제 명령어가 길 수 있는데 `npm run build` 한 줄로 줄여서 쓸 수 있다. 팀원들이 명령어를 외울 필요 없이 통일된 방식으로 실행할 수 있게 해주는 역할이다.

### 명령어는 어디서 오는가

`next build`, `jest`, `node` 이런 것들은 각 패키지가 설치될 때 같이 딸려오는 실행 파일이다.

```bash
npm install next  →  next라는 실행 파일이 node_modules/.bin/에 생김
npm install jest  →  jest라는 실행 파일이 node_modules/.bin/에 생김
```

### 옵션(flag)이란

`--output=standalone --verbose --optimize` 이런 것들을 옵션(flag)이라고 한다.

```
next build
  --output=standalone  # 결과물을 standalone 방식으로 만들어줘
  --verbose            # 진행 상황을 자세히 출력해줘
  --optimize           # 최적화해줘

jest
  --coverage    # 테스트 커버리지 보여줘
  --watchAll    # 파일 변경될 때마다 자동으로 테스트 다시 실행해줘
```

각 패키지를 만든 개발자들이 어떤 옵션을 쓸 수 있는지 정한다. 쓸 수 있는 옵션을 알려면 각 공식 문서를 봐야 한다.

프로젝트가 커질수록 필요한 옵션이 늘어나서 명령어가 길어진다. 그래서 scripts 단축키가 필요한 것이다.

## dependencies vs devDependencies

핵심 차이는 **배포할 때 필요한가, 아닌가**이다.

**dependencies** — 실제 서비스 동작에 필요한 패키지:

```json
"dependencies": {
  "react": "^18.0.0",
  "axios": "^1.0.0"
}
```

**devDependencies** — 개발할 때만 필요한 패키지:

```json
"devDependencies": {
  "eslint": "^8.0.0",
  "jest": "^29.0.0",
  "prettier": "^3.0.0"
}
```

왜 나누냐면 배포 서버에는 실제 서비스에 필요한 것만 설치하면 되기 때문이다.

```
개발 환경: dependencies + devDependencies 전부 설치
배포 서버: dependencies만 설치 → 용량 절약, 속도 향상
```

설치할 때도 구분한다.

```bash
npm install react              # dependencies에 추가
npm install eslint --save-dev  # devDependencies에 추가
npm install eslint -D          # --save-dev의 단축어
```

> 하이픈을 한 개만 적는 경우는 단축어다. 단축어는 첫 글자 하나만 따서 만든다. `--save-dev`가 `-D`가 되는 것처럼.

## pnpm이 빠르고 디스크를 절약하는 원리

핵심은 **하드 링크(Hard link)** 라는 개념이다.

npm과 yarn은 프로젝트마다 패키지를 복사해서 저장한다.

```
프로젝트A/node_modules/lodash  ← lodash 복사본
프로젝트B/node_modules/lodash  ← 또 다른 lodash 복사본
프로젝트C/node_modules/lodash  ← 또 복사본
```

lodash가 10개 프로젝트에 있으면 10번 복사해서 디스크에 10개가 저장된다.

반면 pnpm은 컴퓨터 한 곳에 딱 하나만 저장하고, 각 프로젝트에는 그 파일을 가리키는 링크만 만든다.

```
~/.pnpm-store/lodash  ← 진짜 파일 (딱 1개)

프로젝트A/node_modules/lodash  → 링크 (가리키기만 함)
프로젝트B/node_modules/lodash  → 링크
프로젝트C/node_modules/lodash  → 링크
```

복사가 없으니 디스크 용량이 절약되고, 이미 저장된 파일은 다시 다운로드할 필요가 없으니 속도도 빨라진다.

> `~`는 내 컴퓨터의 홈 디렉토리다. Windows면 `C:/Users/내이름`, Mac이면 `/Users/내이름`이다. 처음 설치할 때만 여기에 실제 파일이 저장되고, 두 번째부터는 이미 있으니까 다운로드 없이 링크만 만든다.

## 유령 의존성 (Phantom Dependency)

단순히 파일이 존재한다는 게 문제가 아니라, **내가 설치 안 했는데 코드에서 가져다 쓸 수 있다**는 게 문제다.

```bash
# 나는 react만 설치했다
npm install react
```

```javascript
// react가 lodash를 필요로 해서 node_modules에 lodash가 깔렸다
// 근데 npm은 이걸 내 코드에서도 쓸 수 있게 허용해버린다

import { isEmpty } from 'lodash'  // 나는 lodash 설치 안 했는데 작동해버림!
```

### 왜 문제인가

지금은 react가 lodash를 쓰니까 node_modules에 있다. 근데 나중에 react가 업데이트되면서 lodash를 안 쓰게 된다면?

```javascript
import { isEmpty } from 'lodash'  // 갑자기 터짐! lodash가 사라졌으니까
```

내 코드는 건드린 게 없는데 react 버전만 올렸는데 갑자기 오류가 날 수 있다.

### pnpm이 유령 의존성을 막는 방법

```javascript
import { isEmpty } from 'lodash'
// 에러: lodash는 package.json에 없습니다. 직접 설치하세요!
```

내가 직접 설치한 것만 import할 수 있게 막아버린다. 그래서 의존성이 명확하게 관리된다.

## 2026년 1월 기준 최신 버전

|  | npm 11 | yarn 4 (Berry) | pnpm 10 |
|--|--------|----------------|---------|
| 설치 방식 | 파일 복사 | PnP (node_modules 없앰) | 하드 링크 |
| 설치 속도 | 보통 | 빠름 | 가장 빠름 |
| 디스크 용량 | 많이 씀 | 적게 씀 | 가장 적게 씀 |
| 유령 의존성 차단 | X | O | O |
| lock 파일 | package-lock.json | yarn.lock | pnpm-lock.yaml |
| 별도 설치 필요 | X (Node.js 내장) | O | O |
| 모노레포 지원 | 기본 수준 | 매우 강력 | 강력 |

## 정리

```bash
npm init -y   # package.json 생성 (프로젝트 설정 파일만)
npm install   # node_modules 생성 (패키지 실제 설치)
```

- **의존성(Dependency)**: 내 코드가 동작하기 위해 필요한 외부 패키지
- **패키지 매니저**: 이 의존성을 설치하고 관리해주는 도구
- **npm**: 기본, **yarn**: npm 개선, **pnpm**: 속도 + 디스크 절약 최강
