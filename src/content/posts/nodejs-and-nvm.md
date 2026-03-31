---
title: "Node.js 설치와 nvm으로 버전 관리하기"
date: "2026-03-21"
description: "Node.js의 개념, 설치 방법, 그리고 실무에서 nvm을 사용하는 이유를 정리합니다."
category: "Node.js"
tags: ["nodejs", "nvm", "설치", "기초"]
---

## Node.js란

Node.js는 **JavaScript를 실행할 수 있는 환경**을 설치하는 것이다.

## Node.js 설치 방법

Node.js는 명령어로 다운로드받는 것이 아니라 직접 사이트에서 설치 파일을 받아서 설치해야 한다.

### 공식 사이트에서 설치

[https://nodejs.org](https://nodejs.org)

여기 들어가면 설치 파일 다운로드 버튼이 바로 있다. Windows, Mac, Linux 다 지원한다.

## 실무에서는 직접 설치하지 않는다

Node.js는 버전이 엄청 많기 때문에, 프로젝트마다 필요한 버전이 달라서 문제가 생긴다.

```
프로젝트A → Node.js 18 버전 필요
프로젝트B → Node.js 20 버전 필요
프로젝트C → Node.js 16 버전 필요
```

그래서 **nvm(Node Version Manager)** 이라는 도구를 사용한다. Node.js 버전을 여러 개 설치하고 프로젝트마다 전환해서 쓸 수 있게 해주는 도구다.

```bash
nvm install 20      # Node.js 20버전 설치
nvm install 18      # Node.js 18버전 설치
nvm use 20          # 20버전으로 전환
nvm use 18          # 18버전으로 전환
```

## 추천 설치 순서

```
1. nvm 설치 (https://github.com/nvm-sh/nvm)
2. nvm으로 Node.js 설치
3. npm은 자동으로 같이 설치됨
```

Node.js를 공식 사이트에서 직접 받아도 되지만, 나중에 버전 관리 때문에 결국 nvm을 쓰게 되는 경우가 많아서 처음부터 nvm으로 설치하는 걸 추천한다.
