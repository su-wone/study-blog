---
title: "Git 필수 명령어 모음"
date: "2026-03-20"
description: "실무에서 자주 사용하는 Git 명령어를 상황별로 정리합니다."
category: "DevOps"
tags: ["git", "버전관리", "devops"]
---

## 기본 워크플로우

```bash
# 저장소 초기화 / 복제
git init
git clone <url>

# 변경사항 확인
git status
git diff

# 스테이징 & 커밋
git add <file>
git add .
git commit -m "메시지"
```

## 브랜치 관리

```bash
# 브랜치 생성 & 이동
git branch feature/login
git checkout feature/login
git checkout -b feature/login  # 생성 + 이동

# 브랜치 목록
git branch        # 로컬
git branch -r     # 원격
git branch -a     # 전체

# 브랜치 삭제
git branch -d feature/login
```

## 병합 (Merge & Rebase)

### Merge

```bash
git checkout main
git merge feature/login
```

### Rebase

```bash
git checkout feature/login
git rebase main
```

> **Merge vs Rebase**: Merge는 히스토리를 보존하고, Rebase는 깔끔한 선형 히스토리를 만듭니다. 공유 브랜치에서는 Merge를, 개인 브랜치에서는 Rebase를 사용하세요.

## 되돌리기

```bash
# 워킹 디렉토리 변경 취소
git checkout -- <file>

# 스테이징 취소
git reset HEAD <file>

# 커밋 취소 (히스토리 유지)
git revert <commit-hash>

# 커밋 취소 (히스토리 삭제 - 주의!)
git reset --hard <commit-hash>
```

## 유용한 명령어

```bash
# 커밋 로그 (간결하게)
git log --oneline --graph

# 임시 저장
git stash
git stash pop

# 특정 커밋 가져오기
git cherry-pick <commit-hash>

# 태그
git tag v1.0.0
git push origin v1.0.0
```

## 자주 하는 실수와 해결법

| 상황 | 해결 |
|------|------|
| 커밋 메시지 수정 | `git commit --amend` |
| 잘못된 브랜치에 커밋 | `git stash` → 브랜치 이동 → `git stash pop` |
| 푸시 후 되돌리기 | `git revert` 사용 (reset 금지) |
| 충돌 발생 | 수동 수정 → `git add` → `git commit` |
