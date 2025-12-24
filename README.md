# RoCo Tech Blog

> Romantic Coders 팀의 기술 블로그입니다.

🔗 **Blog URL**: https://romantic-coders.github.io

## 팀원

- **송근영** (@KeunyoungSong) - Fullstack Developer
- **허동석** (@Dsanj97) - Backend Developer
- **김예림** (@lilble) - Backend Developer
- **김하연** (@kimhayeon00) - Frontend Developer
- **j1nzero** (@j1nzero) - Designer

## 기술 스택

- **Theme**: [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy)
- **Static Site Generator**: Jekyll
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## 글 작성 방법

### 1. 새 포스트 작성

`_posts` 디렉토리에 `YYYY-MM-DD-title.md` 형식으로 파일 생성:

```markdown
---
title: "포스트 제목"
author: KeunyoungSong  # 또는 Dsanj97, lilble, kimhayeon00, j1nzero
date: 2024-12-24 10:00:00 +0900
categories: [카테고리1, 카테고리2]
tags: [태그1, 태그2]
---

여기에 내용 작성...
```

### 2. 로컬 테스트 (선택사항)

```bash
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000` 접속

### 3. 배포

```bash
git add .
git commit -m "포스트 추가: 제목"
git push origin main
```

자동으로 GitHub Actions가 빌드 및 배포를 진행합니다 (약 3-5분 소요).

## 프로필 이미지 추가

각 팀원의 프로필 이미지를 `assets/img/avatars/` 디렉토리에 추가:

- `assets/img/avatars/KeunyoungSong.jpg`
- `assets/img/avatars/Dsanj97.jpg`
- `assets/img/avatars/lilble.jpg`
- `assets/img/avatars/kimhayeon00.jpg`
- `assets/img/avatars/j1nzero.jpg`

## 커스터마이징

`_config.yml` 파일에서 블로그 설정을 변경할 수 있습니다:

- 블로그 제목, 설명
- SNS 링크
- 댓글 시스템 (Giscus)
- 테마 모드 (light/dark)

## 라이선스

이 저장소의 콘텐츠는 팀원들이 작성한 것이며, Chirpy 테마는 MIT 라이선스를 따릅니다.

---

💙 Made with love by RoCo Team
