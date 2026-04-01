---
title: "쉘(Shell)이란? ~/.zshrc 설정 파일 이해하기"
date: "2026-03-21"
description: "쉘의 개념, ~/.zshrc 설정 파일의 역할, 환경변수 등록과 source 명령어를 정리합니다."
category: "DevOps"
tags: ["shell", "zsh", "터미널", "기초"]
order: 1
---

## 쉘(Shell)이란

터미널에서 명령어를 입력하면 그걸 받아서 컴퓨터에 전달해주는 **중간 번역가**다.

```
나 → "nvm install 20" 입력
        ↓
      쉘이 받아서 해석
        ↓
      컴퓨터가 실행
```

Mac은 기본적으로 `zsh`이라는 쉘을 쓴다.

## ~/.zshrc란

쉘이 **시작할 때 자동으로 실행하는 설정 파일**이다.

```
~   = 내 홈 폴더 (/Users/내이름)
.   = 숨김 파일 (파일명 앞에 .이 붙으면 숨김)
rc  = run commands (실행할 명령어들)

~/.zshrc = 내 홈 폴더에 있는 zsh 설정 파일
```

## code ~/.zshrc란

```
code        # VSCode를 실행해줘
~/.zshrc    # 이 파일을
```

"VSCode로 .zshrc 파일을 열어줘"라는 명령어다. `code`는 VSCode가 설치돼 있을 때 터미널에서 VSCode를 여는 명령어다.

## 예시: NVM 설정 코드 세 줄 분석

### 첫 번째 줄

```bash
export NVM_DIR="$HOME/.nvm"
```

```
export  = 환경변수를 등록해줘
NVM_DIR = "nvm이 설치된 폴더가 어디야?"라고 물으면 안내해줄 주소
$HOME   = 내 홈 폴더 경로 (/Users/내이름)

→ "nvm은 내 홈폴더/.nvm에 있어"라고 등록하는 것
```

### 두 번째 줄

```bash
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
```

```
[ -s "경로" ]   = "이 경로에 파일이 존재해?"
&&              = "존재하면"
\. "경로"       = "그 파일을 실행해줘"

→ nvm.sh 파일이 존재하면 실행해서 nvm 명령어를 쓸 수 있게 해줘
```

nvm.sh가 실행돼야 터미널에서 `nvm` 명령어를 쓸 수 있다. 이게 없으면 `nvm: command not found` 오류가 난다.

### 세 번째 줄

```bash
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
```

```
→ nvm 자동완성 기능을 활성화해줘

예: nvm ins 까지만 치고 Tab 누르면 → nvm install로 자동완성
```

## source ~/.zshrc란

```
source   = "이 파일을 지금 당장 실행해줘"
~/.zshrc = 방금 수정한 설정 파일
```

원래 `.zshrc`는 터미널을 새로 열 때 자동으로 실행된다. 근데 터미널을 닫고 다시 열기 귀찮으니까, `source`로 "지금 바로 적용해줘"하는 것이다.

```
터미널 껐다 켜기 = source ~/.zshrc
```

둘은 완전히 같은 효과다.

## 전체 흐름 정리

```
.zshrc 파일
    = 터미널 켤 때마다 자동 실행되는 설정 파일

여기에 nvm 관련 코드 추가
    = "터미널 열릴 때마다 nvm도 자동으로 켜줘"

source ~/.zshrc
    = 지금 당장 적용 (터미널 재시작 없이)
```
