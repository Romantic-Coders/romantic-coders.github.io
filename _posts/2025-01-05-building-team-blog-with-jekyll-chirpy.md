---
title: "Jekyll + Chirpy로 팀 기술 블로그 구축하기: GitHub Pages 완전 정복"
author: KeunyoungSong
date: 2025-01-05 23:00:00 +0900
categories: [개발, 블로그]
tags: [jekyll, github-pages, chirpy, github-actions, ci-cd]
mermaid: true
---

# Jekyll + Chirpy로 팀 기술 블로그 구축하기

RoCo 팀의 기술 블로그를 GitHub Pages로 구축하면서 겪은 시행착오와 해결 과정을 공유합니다. Jekyll과 Chirpy 테마를 사용하여 블로그를 만들고, GitHub Actions로 자동 배포를 설정하는 전 과정을 담았습니다.

## 1. 도입부

### 왜 팀 블로그를 만들게 되었나?

Connectify 프로젝트를 진행하면서 다양한 기술적 도전과 학습을 경험하고 있습니다. 이러한 경험들을 체계적으로 기록하고, 팀원들과 공유하며, 더 나아가 외부 개발자들에게도 도움이 되는 콘텐츠를 만들고자 팀 블로그를 개설하게 되었습니다.

### 기술 스택 선택 이유

**GitHub Pages를 선택한 이유:**
- 무료 호스팅 (비용 부담 없음)
- GitHub과의 완벽한 통합
- HTTPS 자동 지원
- 별도의 서버 관리 불필요

**Jekyll + Chirpy 테마 선택:**
- Markdown으로 간편한 글 작성
- 기술 블로그에 최적화된 UI/UX
- 다크모드, 목차(TOC), 검색 기능 내장
- 활발한 커뮤니티와 문서화

## 2. GitHub 블로그 생태계 이해하기

### GitHub Pages란 무엇인가?

**GitHub Pages는 GitHub에서 제공하는 무료 정적 웹사이트 호스팅 서비스입니다.**

정적 웹사이트란 서버 코드 없이 HTML, CSS, JavaScript만으로 구성된 웹사이트를 의미합니다. GitHub Pages는 저장소의 파일들을 실제 웹사이트로 배포해주며, `username.github.io` 또는 `organization.github.io` 도메인을 제공합니다.

**작동 방식:**

```
저장소의 파일들 → GitHub Pages 처리 → https://romantic-coders.github.io 배포
```

**저장소 구조 예시:**

```console
romantic-coders.github.io/
├── _posts/2025-01-05-title.md  # 마크다운 파일
├── _config.yml                  # 설정 파일
└── index.html                   # 메인 페이지
```

### Jekyll이란?

Jekyll은 Ruby 기반의 **정적 사이트 생성기(Static Site Generator)**입니다.

**주요 역할:**
- Markdown 파일을 HTML로 자동 변환
- Liquid 템플릿 엔진으로 동적 콘텐츠 생성
- `_posts/`, `_layouts/`, `_includes/` 등의 구조화된 디렉토리 사용
- 플러그인 시스템으로 기능 확장

**변환 과정:**

```markdown
# _posts/2025-01-05-hello.md
---
title: "Hello World"
---
안녕하세요!
```

↓ Jekyll이 변환 ↓

```html
<h1>Hello World</h1>
<p>안녕하세요!</p>
```

### Chirpy 테마 소개

Chirpy는 Jekyll용 테마로, 기술 블로그에 최적화되어 있습니다.

**주요 기능:**
- 📱 반응형 디자인 (모바일 최적화)
- 🌙 다크모드/라이트모드 전환
- 🔍 전체 검색 기능
- 📑 자동 목차(TOC) 생성
- 📊 카테고리 & 태그 시스템
- 💬 댓글 시스템 통합 지원

## 3. 배포 자동화 이해하기

### GitHub Actions란?

GitHub Actions는 GitHub에서 제공하는 **CI/CD(Continuous Integration/Continuous Deployment) 도구**입니다.

**CI/CD란?**
- **CI (Continuous Integration)**: 코드 변경사항을 자동으로 빌드하고 테스트
- **CD (Continuous Deployment)**: 빌드된 결과물을 자동으로 배포

**우리 블로그의 CI/CD 프로세스:**

```
코드 Push → GitHub Actions 실행 → Jekyll 빌드 → GitHub Pages 배포 (약 1-2분 소요)
```

### 두 가지 배포 방식의 차이

블로그를 구축하면서 두 가지 배포 방식을 접하게 되었습니다.

#### 1. `pages build and deployment` (GitHub 기본)

GitHub Pages를 활성화하면 자동으로 생성되는 시스템 워크플로우입니다.

**특징:**
- GitHub이 자동으로 관리
- 제한된 플러그인만 지원 (보안상 이유)
- 복잡한 테마나 커스텀 설정 처리 어려움
- Chirpy 테마 같은 경우 의존성 문제로 실패

**왜 실패했나?**

초기 시도(2024-12-24):
```
pages build and deployment 실행
  → jekyll-archives 플러그인 없음 ❌
  → jekyll-include-cache 플러그인 없음 ❌
  → 빌드 실패
```

GitHub의 기본 빌드는 안전한 플러그인만 허용하기 때문에 Chirpy 테마가 요구하는 플러그인들을 사용할 수 없었습니다.

#### 2. `Deploy Jekyll site to Pages` (커스텀 워크플로우)

직접 만든 워크플로우로 전체 빌드 과정을 제어합니다.

**장점:**
- 모든 플러그인 자유롭게 사용 가능
- 빌드 과정 완전 제어
- 디버깅 용이
- 복잡한 의존성 처리 가능

### 현재 배포 프로세스 전체 흐름

```mermaid
graph TD
    A[로컬 개발 환경<br/>_posts/2025-01-05-new-post.md 작성] --> B[git add, commit, push]
    B --> C[GitHub Repository<br/>romantic-coders.github.io]
    C --> D[.github/workflows/pages-deploy.yml 감지]
    D --> E[GitHub Actions 실행]

    E --> F[Job 1: build]
    F --> F1[1. Ruby 3.2 설치]
    F1 --> F2[2. bundle install]
    F2 --> F3[3. jekyll build<br/>→ _site/ 폴더 생성]
    F3 --> F4[4. artifact 업로드]

    F4 --> G[Job 2: deploy]
    G --> G1[1. artifact 다운로드]
    G1 --> G2[2. GitHub Pages에 배포]

    G2 --> H[배포 완료<br/>https://romantic-coders.github.io]

    style A fill:#e1f5fe,color:#0b0f14
    style H fill:#c8e6c9,color:#0b0f14
    style E fill:#fff9c4,color:#0b0f14
    style F fill:#ffe0b2,color:#0b0f14
    style G fill:#ffe0b2,color:#0b0f14
```

**소요 시간:** push 후 약 1-2분 내 배포 완료

## 4. 구축 과정과 마주친 문제들

### 문제 1: Jekyll 버전 호환성

**에러 메시지:**

```
Could not find compatible versions
Because github-pages >= 117, < 178 depends on jekyll-sass-converter = 1.5.0
  and github-pages >= 44, < 147 depends on liquid = 3.0.6,
  github-pages >= 44, < 178 requires jekyll-sass-converter = 1.5.0 or liquid = 3.0.6.
...
version solving has failed.
```

**원인:**

초기 Gemfile에서 `jekyll 4.3`과 `github-pages` gem을 함께 사용하려고 했습니다. 하지만 `github-pages` gem은 특정 버전의 Jekyll만 지원하므로 충돌이 발생했습니다.

**해결:**

`github-pages` gem을 제거하고 필요한 플러그인을 직접 명시했습니다.

```ruby
# 변경 전
gem "jekyll", "~> 4.3"
gem "github-pages", group: :jekyll_plugins

# 변경 후
gem "jekyll", "~> 4.3"
gem "jekyll-theme-chirpy", "~> 7.4"
gem "jekyll-paginate"
gem "jekyll-sitemap"
# ... 필요한 플러그인 직접 추가
```

### 문제 2: 누락된 플러그인들

**에러 1: jekyll-archives**

```
Dependency Error: Yikes! It looks like you don't have jekyll-archives
or one of its dependencies installed.
ERROR: YOUR SITE COULD NOT BE BUILT:
       jekyll-archives
```

**에러 2: jekyll-include-cache**

```
Dependency Error: Yikes! It looks like you don't have jekyll-include-cache
or one of its dependencies installed.
ERROR: YOUR SITE COULD NOT BE BUILT:
       jekyll-include-cache
```

**원인:**

Chirpy 테마가 의존하는 플러그인들이 Gemfile에 명시되지 않았습니다. 테마가 이 플러그인들을 사용하는데, 설치되지 않아 빌드가 실패했습니다.

**해결:**

Gemfile과 _config.yml에 누락된 플러그인을 추가했습니다.

```ruby
# Gemfile에 추가
gem "jekyll-archives"
gem "jekyll-include-cache"
```

```yaml
# _config.yml에 추가
plugins:
  - jekyll-archives
  - jekyll-include-cache
```

### 문제 3: remote_theme vs gem-based theme

**에러 메시지:**

```
Liquid Exception: undefined method `version' for
#<Jekyll::RemoteTheme::MockGemspec:...> in /tmp/jekyll-remote-theme.../default.html
```

**원인:**

`jekyll-remote-theme` 플러그인과 Jekyll 4의 호환성 문제였습니다. `remote_theme` 방식은 GitHub에서 테마를 동적으로 가져오는데, Jekyll 4의 내부 구조 변경으로 인해 테마의 버전 정보를 읽지 못했습니다.

**해결:**

`remote_theme` 방식을 포기하고 gem 기반 테마로 전환했습니다.

```yaml
# _config.yml 변경 전
remote_theme: cotes2020/jekyll-theme-chirpy

# 변경 후
theme: jekyll-theme-chirpy
```

```ruby
# Gemfile 변경
gem "jekyll-theme-chirpy", "~> 7.4"  # gem으로 직접 설치
```

**차이점:**

| 방식 | remote_theme | gem-based theme |
|------|-------------|----------------|
| 설치 방법 | GitHub에서 다운로드 | RubyGems에서 설치 |
| 버전 관리 | branch/tag | semantic versioning |
| 호환성 | Jekyll 3 최적화 | Jekyll 4 지원 |
| 빌드 속도 | 느림 (매번 다운로드) | 빠름 (로컬 캐시) |

### 문제 4: GitHub Actions 워크플로우 설정

**초기 실패 원인:**

GitHub의 기본 빌드 방식으로는 Chirpy 테마의 모든 의존성을 처리할 수 없었습니다.

**해결: 커스텀 워크플로우 생성**

`.github/workflows/pages-deploy.yml` 파일을 생성하여 빌드 과정을 직접 제어했습니다.

```yaml
name: Deploy Jekyll site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4

      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
{: file=".github/workflows/pages-deploy.yml" }

**주요 포인트:**

1. **두 개의 Job 분리**: `build`와 `deploy`를 분리하여 각 단계를 명확히 구분
2. **의존성 캐싱**: `bundler-cache: true`로 빌드 속도 향상
3. **환경 변수**: `JEKYLL_ENV: production`으로 최적화된 빌드
4. **전체 히스토리**: `fetch-depth: 0`으로 sitemap 생성에 필요한 날짜 정보 확보

### 문제 5: 로컬 테스트 환경 구축

배포는 성공했지만, 로컬에서 블로그를 미리 확인하고 싶었습니다. 그런데 로컬 테스트 환경을 구축하는 과정에서 Ruby 버전 문제를 마주했습니다.

**첫 번째 시도: jekyll serve 실행**

```bash
bundle exec jekyll serve
```

**에러:**

```
bundler: command not found: jekyll
Install missing gem executables with `bundle install`
```

**두 번째 시도: bundle install**

```bash
bundle install
```

**에러:**

```
Bundler could not find compatible versions for gem "ruby":
  html-proofer (~> 5.0) requires ruby (>= 3.1, < 4.0)

Current Ruby version: 2.6.10
```

**원인:**

macOS에 기본 설치된 Ruby 2.6.10을 사용하고 있었는데, Chirpy 테마와 의존성들이 Ruby 3.0 이상을 요구했습니다.

- **jekyll-theme-chirpy 7.4**: Ruby >= 3.1 필요
- **html-proofer 5.0**: Ruby >= 3.1 필요
- **ffi (의존성)**: Ruby >= 3.0 필요

**해결: rbenv로 Ruby 버전 관리**

macOS에서 Ruby 버전을 관리하는 가장 일반적인 방법은 `rbenv`를 사용하는 것입니다.

**1. rbenv 설치 (Homebrew 사용)**

```bash
# rbenv와 ruby-build 설치
brew install rbenv ruby-build

# zsh 설정 파일에 rbenv 초기화 추가
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc

# 터미널 재시작 또는 설정 다시 로드
source ~/.zshrc
```

**2. Ruby 3.2.0 설치**

```bash
# Ruby 3.2.0 설치 (약 5-10분 소요)
rbenv install 3.2.0

# 전역 Ruby 버전을 3.2.0으로 설정
rbenv global 3.2.0

# 버전 확인
ruby --version
# ruby 3.2.0 (2022-12-25 revision a528908271) [arm64-darwin24]
```

**3. 의존성 설치 및 서버 실행**

```bash
# 프로젝트 디렉토리로 이동
cd romantic-coders.github.io

# Jekyll 및 모든 의존성 설치
bundle install

# 로컬 개발 서버 실행
bundle exec jekyll serve
```

**성공:**

```
Configuration file: /Users/.../romantic-coders.github.io/_config.yml
            Source: /Users/.../romantic-coders.github.io
       Destination: /Users/.../romantic-coders.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 1.442 seconds.
 Auto-regeneration: enabled for '/Users/.../romantic-coders.github.io'
    Server address: http://127.0.0.1:4000
  Server running... press ctrl-c to stop.
```

**로컬 테스트 방법:**

1. 브라우저에서 `http://127.0.0.1:4000` 접속
2. 파일을 수정하면 자동으로 재빌드되어 바로 확인 가능
3. 서버 종료: `Ctrl + C`

**팀원들을 위한 Ruby 버전 관리 가이드:**

```mermaid
graph TD
    A[로컬에서 블로그 테스트 필요] --> B{Ruby 버전 확인<br/>ruby --version}
    B -->|3.0 이상| C[bundle install]
    B -->|3.0 미만| D[rbenv 설치 필요]

    D --> E[brew install rbenv]
    E --> F[rbenv install 3.2.0]
    F --> G[rbenv global 3.2.0]
    G --> C

    C --> H[bundle exec jekyll serve]
    H --> I[http://127.0.0.1:4000 접속]

    style A fill:#e1f5fe,color:#0b0f14
    style I fill:#c8e6c9,color:#0b0f14
    style D fill:#fff9c4,color:#0b0f14
    style H fill:#c8e6c9,color:#0b0f14
```

**왜 GitHub Actions는 성공했고 로컬은 실패했나?**

GitHub Actions 워크플로우에서 명시적으로 Ruby 3.2를 설정했기 때문입니다:

```yaml
- name: Setup Ruby
  uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.2'  # 항상 3.2 버전 사용
    bundler-cache: true
```

반면 로컬 환경은 시스템에 설치된 Ruby를 사용하므로, 버전이 맞지 않으면 에러가 발생합니다.

**추가 이슈: rbenv 설정 후에도 시스템 Ruby 사용**

rbenv를 설치하고 Ruby 3.2.0을 설정했는데도 여전히 시스템 Ruby 2.6.10이 사용되는 경우가 있습니다.

```bash
ruby --version
# ruby 2.6.10p210 (2022-04-12 revision 67958) [universal.arm64e-darwin24]

which ruby
# /usr/bin/ruby  # 시스템 Ruby!
```

**원인:**

터미널이 rbenv를 인식하지 못하고 있습니다. `~/.zshrc`에 rbenv 초기화 코드를 추가했지만, 현재 터미널 세션에는 적용되지 않았거나 PATH 설정이 제대로 되지 않았습니다.

**해결 방법 1: 터미널 재시작**

```bash
# 터미널을 완전히 종료하고 다시 시작
# 또는
source ~/.zshrc

# 확인
ruby --version
# ruby 3.2.0 (2022-12-25 revision a528908271) [arm64-darwin24]
```

**해결 방법 2: 현재 세션에서 즉시 적용**

터미널을 재시작하지 않고 현재 세션에서 rbenv를 사용하려면:

```bash
eval "$(rbenv init - zsh)"

# 확인
ruby --version
# ruby 3.2.0 (2022-12-25 revision a528908271) [arm64-darwin24]

which ruby
# /Users/username/.rbenv/shims/ruby  # rbenv의 Ruby!

# 이제 Jekyll 서버 실행
bundle exec jekyll serve
```

**중요한 교훈:**

1. **로컬과 CI/CD 환경의 일관성**: 가능한 한 로컬 환경을 CI/CD 환경과 동일하게 맞추는 것이 중요합니다
2. **Ruby 버전 관리**: rbenv, rvm 등의 버전 관리 도구 사용이 필수적입니다
3. **환경 변수 초기화**: rbenv 설치 후 반드시 터미널 재시작 또는 `source ~/.zshrc` 필요
4. **PATH 우선순위 확인**: `which ruby`로 실제 사용 중인 Ruby 경로 확인
5. **팀원 온보딩**: 새로운 팀원이 로컬 환경을 쉽게 구축할 수 있도록 명확한 가이드가 필요합니다

### 로컬 테스트 서버 동작 원리

`bundle exec jekyll serve` 명령어는 로컬 컴퓨터에서 웹 서버를 실행합니다.

**전체 동작 흐름:**

```mermaid
graph LR
    A[bundle exec jekyll serve] --> B[Jekyll 빌드 프로세스]
    B --> C[_site/ 폴더 생성]
    C --> D[WEBrick 서버 시작]
    D --> E[포트 4000 대기]
    E --> F[브라우저에서<br/>127.0.0.1:4000 접속]

    style A fill:#e1f5fe,color:#0b0f14
    style D fill:#fff9c4,color:#0b0f14
    style F fill:#c8e6c9,color:#0b0f14
```

**단계별 설명:**

**1. 빌드 단계**

Jekyll이 프로젝트의 모든 파일을 처리합니다:

```
_posts/2025-01-05-building-team-blog.md (Markdown)
    ↓ Jekyll 처리
    ↓ 1. Markdown → HTML 변환
    ↓ 2. Liquid 템플릿 적용
    ↓ 3. SCSS → CSS 컴파일
    ↓
_site/posts/building-team-blog/index.html (정적 HTML)
```

**2. 서버 시작**

- WEBrick(Ruby 기본 웹 서버)가 `127.0.0.1:4000`에서 시작
- `_site/` 폴더의 정적 파일들을 서빙
- HTTP 요청을 받아 해당 파일을 반환

**3. 자동 재빌드 (Auto-regeneration)**

파일 변경 감지 시스템이 작동합니다:

```bash
# 파일 수정 및 저장
$ vim _posts/2025-01-05-building-team-blog.md
# (수정 후 Cmd+S)

# 터미널 출력:
      Regenerating: 1 file(s) changed at 2025-01-05 15:30:42
                    _posts/2025-01-05-building-team-blog.md
                    ...done in 0.82 seconds.

# 브라우저에서 새로고침하면 변경사항 즉시 확인!
```

**파일 구조 비교:**

```console
# 소스 파일 (작성하는 파일)
romantic-coders.github.io/
├── _posts/
│   └── 2025-01-05-building-team-blog.md    # Markdown 원본
├── _config.yml                              # 설정
└── assets/
    └── css/
        └── main.scss                        # SCSS 원본

# 빌드 결과물 (_site/ 폴더, .gitignore에 등록됨)
_site/
├── posts/
│   └── building-team-blog/
│       └── index.html                       # 변환된 HTML
├── assets/
│   └── css/
│       └── main.css                         # 컴파일된 CSS
└── index.html
```

**실시간 개발 워크플로우:**

```mermaid
graph TD
    A[에디터에서 파일 수정] --> B[파일 저장<br/>Cmd+S]
    B --> C[Jekyll 변경 감지]
    C --> D[자동 재빌드<br/>1-2초]
    D --> E[브라우저 새로고침<br/>F5]
    E --> F[변경사항 확인]
    F --> A

    style A fill:#e1f5fe,color:#0b0f14
    style D fill:#fff9c4,color:#0b0f14
    style F fill:#c8e6c9,color:#0b0f14
```

**자동 재빌드되는 파일:**
- `_posts/` - 블로그 게시물
- `_pages/` - 일반 페이지
- `_layouts/` - 레이아웃 템플릿
- `_includes/` - 재사용 컴포넌트
- `assets/` - CSS, JavaScript, 이미지

**재빌드되지 않는 파일 (서버 재시작 필요):**
- `_config.yml` - Jekyll 설정 파일
- `Gemfile` - Ruby 의존성 파일

**_config.yml 수정 시:**

```bash
# 1. _config.yml 수정 후 저장
# → 자동 재빌드 안 됨!

# 2. 서버 종료
Ctrl + C

# 3. 서버 재시작
bundle exec jekyll serve

# 4. 브라우저 새로고침하면 설정 변경사항 반영
```

**로컬 서버 vs GitHub Pages 비교:**

| 구분 | 로컬 서버 | GitHub Pages |
|------|----------|--------------|
| **위치** | 내 컴퓨터 (127.0.0.1) | GitHub 서버 |
| **빌드** | 내 컴퓨터에서 Jekyll 실행 | GitHub Actions에서 실행 |
| **접근 권한** | 나만 접근 가능 | 전 세계 누구나 접근 |
| **URL** | http://127.0.0.1:4000 | https://romantic-coders.github.io |
| **목적** | 개발/테스트 | 실제 배포 |
| **재빌드** | 파일 저장 시 즉시 (1-2초) | git push 시 1-2분 후 |
| **디버깅** | 터미널에서 즉시 확인 | Actions 로그 확인 필요 |

**브라우저 캐시 관련 팁:**

CSS나 JavaScript 변경사항이 안 보일 때:

- **일반 새로고침**: `F5` 또는 `Cmd+R`
- **강력 새로고침** (캐시 무시): `Cmd+Shift+R` (Mac) 또는 `Ctrl+Shift+R` (Windows/Linux)

**추가 유용한 옵션:**

```bash
# 초안(draft) 게시물도 포함하여 서버 실행
bundle exec jekyll serve --drafts

# 미래 날짜 게시물도 표시
bundle exec jekyll serve --future

# 특정 포트에서 실행
bundle exec jekyll serve --port 4001

# 증분 빌드 활성화 (빌드 속도 향상)
bundle exec jekyll serve --incremental
```

### 문제 6: YAML 코드 블록 줄바꿈 문제

로컬 테스트 환경을 구축하고 나니 또 다른 문제가 발생했습니다. 블로그 글에 GitHub Actions 워크플로우 YAML 코드를 작성했는데, **모든 줄바꿈과 인덴트가 사라지고 한 줄로 표시**되는 것이었습니다.

**증상:**

```yaml
name: Deploy Jekyll site to Pages on: push: branches: ["main"] workflow_dispatch: permissions: contents: read pages: write ...
```

이렇게 모든 내용이 한 줄에 표시되어 코드를 읽을 수 없었습니다. 다른 언어(shell, ruby 등) 코드 블록은 정상적으로 작동하는데 유독 YAML만 문제가 있었습니다.

**시도했던 실패한 해결 방법:**

1. **raw 태그 추가** - Liquid의 raw 태그로 코드 블록을 감싸봤지만 효과가 없었습니다. Liquid 파싱 문제가 아니었습니다.

2. **언어 지정 제거** - 백틱 3개만 사용하고 yaml을 제거해봤지만 오히려 더 나빠졌습니다. 신택스 하이라이팅도 사라졌습니다.

3. **CSS `white-space: pre-wrap` 추가** - CSS로 `.highlight code { white-space: pre-wrap !important; }` 를 추가했지만 효과가 없었습니다. HTML 자체에 줄바꿈이 없었습니다.

4. **HTML `<pre><code>` 태그 직접 사용** - `<pre><code class="language-yaml">` 태그를 직접 사용했지만 코드 블록 UI가 사라지고 일반 텍스트처럼 표시되었습니다.

5. **`<div>` 태그로 파일명 헤더 추가** - `<div class="code-header">` 태그를 코드 블록 앞에 추가했지만 kramdown이 코드 블록을 제대로 파싱하지 못했습니다.

**근본 원인 발견:**

다른 Chirpy 블로그들을 조사하다가 **줄 번호가 있는 코드 블록은 정상 작동**한다는 것을 발견했습니다!

Chirpy 테마는 Rouge 신택스 하이라이터를 사용하는데, 줄 번호가 비활성화된 상태에서는 코드 블록이 테이블 구조 없이 렌더링되면서 줄바꿈 처리에 문제가 생기는 것이었습니다.

**해결책:**

`_config.yml`에 kramdown 줄 번호 설정을 추가했습니다:

```yaml
kramdown:
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    default_lang: plaintext
    line_numbers: false      # 인라인 코드에는 줄 번호 없음
    block:
      line_numbers: true     # 코드 블록에만 줄 번호 표시
```
{: file="_config.yml" }

**Chirpy 파일명 표시 문법:**

추가로 Chirpy의 공식 파일명 표시 문법도 적용했습니다. 코드 블록 닫는 백틱 3개 바로 다음 줄에 `{: file="파일경로" }` 속성을 추가하면 코드 블록 상단에 파일명이 표시됩니다.

중요한 점은 `{: file="..." }` 속성이 **코드 블록 닫는 백틱 다음 줄**에 와야 한다는 것입니다!

**결과:**

이제 YAML 코드 블록이 줄 번호와 함께 정상적으로 렌더링됩니다:

```yaml
name: Deploy Jekyll site to Pages
on:
  push:
    branches: ["main"]
  workflow_dispatch:
```
{: file=".github/workflows/pages-deploy.yml" }

### 문제 7: 인라인 코드에 줄 번호 표시 문제

YAML 코드 블록 문제를 해결했더니 이번에는 **본문 중 인라인 코드에도 줄 번호가 표시**되는 문제가 발생했습니다.

**증상:**

"두 개의 Job 분리: `build`와 `deploy`를 분리하여..."

이렇게 작성한 부분이 다음과 같이 렌더링되었습니다:

```
두 개의 Job 분리: [1] build 와 [1] deploy 를 분리하여...
```

본문 중간의 변수명이나 명령어 같은 한 줄 코드에도 줄 번호가 붙어서 UI가 깨져 보이고 가독성이 크게 떨어졌습니다.

**원인:**

처음 kramdown 설정에서 `line_numbers: true`만 설정했더니 **모든 코드 (인라인 + 블록)**에 줄 번호가 적용되었습니다.

```yaml
# 잘못된 설정
kramdown:
  syntax_highlighter_opts:
    line_numbers: true    # 모든 코드에 줄 번호!
```

**해결책:**

전역 설정과 블록 설정을 분리했습니다:

```yaml
kramdown:
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    default_lang: plaintext
    line_numbers: false      # 인라인 코드에는 줄 번호 없음
    block:
      line_numbers: true     # 코드 블록에만 줄 번호 표시
```
{: file="_config.yml" }

**결과:**

이제 인라인 코드 `` `build` ``, `` `deploy` ``, `` `bundler-cache: true` ``는 줄 번호 없이 깔끔하게 표시되고, 멀티라인 코드 블록만 줄 번호와 함께 표시됩니다.

### 문제 8: Mermaid 다이어그램 다크모드 가독성

블로그를 다크모드로 설정했는데(`theme_mode: dark`), Mermaid 다이어그램에서 **텍스트가 보이지 않는 문제**가 발생했습니다.

**증상:**

```mermaid
graph TD
    A[로컬 개발] --> B[Git Push]
    B --> C[GitHub Actions]
```

다크모드의 기본 텍스트 색상(회백색)이 Mermaid 다이어그램의 밝은 배경 박스에서는 거의 보이지 않았습니다.

**고려한 해결 방법 1: CSS 전역 설정**

```scss
// assets/css/jekyll-theme-chirpy.scss
.mermaid {
  text {
    fill: #000 !important;  // 모든 Mermaid 텍스트를 검은색으로
  }

  rect {
    fill: #f0f0f0 !important;  // 모든 박스를 밝은 회색으로
  }
}
```

**CSS 방식의 문제점:**
- 모든 다이어그램에 동일한 스타일이 강제 적용
- 다이어그램마다 다른 색상이 필요할 때 대응 불가
- 라이트/다크 모드 전환 시 CSS 충돌 가능
- 나중에 다른 색상이 필요하면 CSS를 오버라이드해야 하는 번거로움

**최종 해결책: Mermaid 코드 내 직접 스타일 지정**

각 다이어그램 코드 내에서 `style` 또는 `classDef`로 직접 스타일을 지정하기로 결정했습니다. Mermaid 코드 블록 안에서 `style 노드ID fill:#색상,color:#텍스트색` 형식으로 각 노드의 배경색과 텍스트 색상을 지정할 수 있습니다.

**이 방식의 장점:**
- ✅ 각 다이어그램마다 필요한 색상만 정확히 적용
- ✅ 코드만 보고 어떻게 렌더링될지 예측 가능
- ✅ 다이어그램 타입별로 다른 스타일 자유롭게 적용
- ✅ CSS 파일 관리 불필요
- ✅ 글 작성자가 의도한 색상으로 정확히 표현

**CSS 파일에 방침 명시:**

나중에 팀원들이 "왜 Mermaid CSS가 없지?"라고 궁금해할 수 있으므로 주석으로 방침을 명시했습니다:

```scss
---
---

@import 'main';

/* Custom CSS - 코드 블록은 기본 동작(수평 스크롤) 유지 */

/* Mermaid: prefer per-diagram styling via `style`/`classDef` in Mermaid code */
```
{: file="assets/css/jekyll-theme-chirpy.scss" }

**결과:**

이제 각 다이어그램에서 필요한 색상을 직접 지정하여 다크모드에서도 가독성 좋은 다이어그램을 표시할 수 있습니다.

```mermaid
graph TD
    A[문제 발생] --> B[원인 분석]
    B --> C[해결책 탐색]
    C --> D[최적 방법 선택]
    D --> E[문서화]

    style A fill:#ffcdd2,color:#0b0f14
    style B fill:#fff9c4,color:#0b0f14
    style C fill:#c8e6c9,color:#0b0f14
    style D fill:#bbdefb,color:#0b0f14
    style E fill:#e1bee7,color:#0b0f14
```

## 5. 최종 구성

### Gemfile 전체 코드 (주석 포함)

```ruby
source "https://rubygems.org"

# Jekyll 코어 (4.3 버전 사용, 설치된 버전: 4.4.1)
gem "jekyll", "~> 4.3"

# Chirpy 테마 (gem 방식으로 설치)
gem "jekyll-theme-chirpy", "~> 7.4"  # 설치된 버전: 7.4.1

# 필수 Jekyll 플러그인
gem "jekyll-paginate"        # 페이지네이션 (게시물 목록 페이징)
gem "jekyll-sitemap"         # sitemap.xml 자동 생성 (SEO)
gem "jekyll-seo-tag"         # SEO 메타 태그 자동 생성
gem "jekyll-archives"        # 카테고리/태그 아카이브 페이지
gem "jekyll-include-cache"   # include 성능 최적화

# Markdown 파서
gem "kramdown-parser-gfm"    # GitHub Flavored Markdown 지원

# Ruby 3.x 호환성
gem "webrick"                # Ruby 3.x에서 Jekyll 서버 실행용
gem "csv"                    # Ruby 3.x에서 csv 라이브러리
gem "base64"                 # Ruby 3.x에서 base64 라이브러리

# 테스트 도구 (선택사항)
group :test do
  gem "html-proofer", "~> 5.0"  # HTML 유효성 검사
end

# Windows/JRuby 플랫폼 지원
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"    # 타임존 정보
  gem "tzinfo-data"              # 타임존 데이터
end

# Windows 파일 변경 감지
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
```

### _config.yml 주요 설정 (주석 포함)

```yaml
# ========================================
# 사이트 기본 설정
# ========================================

# 테마 설정 (gem 기반)
theme: jekyll-theme-chirpy

# 언어 및 타임존
lang: ko-KR
timezone: Asia/Seoul

# 사이트 정보
title: RoCo Tech Blog
tagline: Romantic Coders의 개발 여정
description: 서비스 개발 회고와 기술 경험을 공유하는 RoCo 팀 블로그

# 배포 URL
url: "https://romantic-coders.github.io"

# GitHub 정보
github:
  username: Romantic-Coders

# 소셜 정보
social:
  name: RoCo Team
  email: team@roco.dev
  links:
    - https://github.com/Romantic-Coders

# 기본 작성자 정보
author:
  name: RoCo Team
  bio: 낭만적인 코더들의 모임

# ========================================
# 다중 작성자 설정
# ========================================
# 각 포스트의 front matter에서 author: KeunyoungSong 형식으로 사용

authors:
  KeunyoungSong:
    name: "송근영"
    bio: "Fullstack Developer"
    avatar: "/assets/img/avatars/KeunyoungSong.jpg"
    links:
      - label: "GitHub"
        icon: "fab fa-github"
        url: "https://github.com/KeunyoungSong"

  Dsanj97:
    name: "허동석"
    bio: "Backend Developer"
    avatar: "/assets/img/avatars/Dsanj97.jpg"
    links:
      - label: "GitHub"
        icon: "fab fa-github"
        url: "https://github.com/Dsanj97"

  lilble:
    name: "김예림"
    bio: "Backend Developer"
    avatar: "/assets/img/avatars/lilble.jpg"
    links:
      - label: "GitHub"
        icon: "fab fa-github"
        url: "https://github.com/lilble"

  kimhayeon00:
    name: "김하연"
    bio: "Frontend Developer"
    avatar: "/assets/img/avatars/kimhayeon00.jpg"
    links:
      - label: "GitHub"
        icon: "fab fa-github"
        url: "https://github.com/kimhayeon00"

  j1nzero:
    name: "고진영"
    bio: "Designer"
    avatar: "/assets/img/avatars/j1nzero.jpg"
    links:
      - label: "GitHub"
        icon: "fab fa-github"
        url: "https://github.com/j1nzero"

# ========================================
# 테마 및 UI 설정
# ========================================

theme_mode: dark        # 기본 테마 (dark/light)
avatar: /assets/img/roco-logo.png  # 사이트 로고
toc: true              # 목차(Table of Contents) 자동 생성
paginate: 10           # 페이지당 게시물 수
markdown: kramdown     # Markdown 엔진

# ========================================
# Jekyll 플러그인
# ========================================

plugins:
  - jekyll-paginate       # 페이지네이션
  - jekyll-sitemap        # sitemap.xml 생성
  - jekyll-seo-tag        # SEO 메타 태그
  - jekyll-archives       # 카테고리/태그 아카이브
  - jekyll-include-cache  # include 캐싱

# ========================================
# Markdown 설정
# ========================================

kramdown:
  syntax_highlighter: rouge  # 코드 하이라이팅
  syntax_highlighter_opts:
    default_lang: plaintext
    line_numbers: false      # 인라인 코드에는 줄 번호 없음
    block:
      line_numbers: true     # 코드 블록에만 줄 번호 표시

# ========================================
# Collections (탭 메뉴)
# ========================================

collections:
  tabs:
    output: true
    sort_by: order

# ========================================
# 기본값 설정
# ========================================

defaults:
  # 모든 포스트의 기본값
  - scope:
      path: ""
      type: posts
    values:
      layout: post
      comments: true        # 댓글 활성화
      toc: true            # 목차 활성화
      permalink: /posts/:title/

  # 탭 페이지의 기본값
  - scope:
      path: ""
      type: tabs
    values:
      layout: page
      permalink: /:title/
```

### 디렉토리 구조

```console
romantic-coders.github.io/
├── .github/
│   └── workflows/
│       └── pages-deploy.yml     # GitHub Actions 워크플로우
├── _posts/                      # 블로그 게시물
│   ├── 2024-12-24-welcome-to-roco-blog.md
│   └── 2025-01-05-building-team-blog.md
├── _tabs/                       # 상단 탭 메뉴 페이지
│   └── about.md                 # About 페이지
├── assets/
│   └── img/
│       ├── avatars/             # 작성자 프로필 이미지
│       │   ├── KeunyoungSong.jpg
│       │   ├── Dsanj97.jpg
│       │   └── ...
│       └── roco-logo.png        # 사이트 로고
├── _config.yml                  # Jekyll 설정 파일
├── Gemfile                      # Ruby 의존성 관리
├── .gitignore                   # Git 무시 파일 목록
├── index.html                   # 메인 페이지
└── README.md                    # 프로젝트 설명
```

### .gitignore 설정

```plaintext
# Bundler 캐시 (로컬 gem 설치 디렉토리)
.bundle
vendor
Gemfile.lock                     # 버전 잠금 파일 (CI에서 재생성)

# Jekyll 캐시 (빌드 시 자동 생성)
.jekyll-cache
.jekyll-metadata                 # 증분 빌드용 메타데이터
.sass-cache                      # Sass 컴파일 캐시
_site                            # 빌드 결과물 디렉토리

# RubyGems
*.gem

# NPM 의존성 (프론트엔드 도구 사용 시)
node_modules
package-lock.json
yarn.lock

# IDE 설정
.idea                            # IntelliJ IDEA
.vscode                          # Visual Studio Code
.claude                          # Claude Code CLI

# 기타
assets/js/dist                   # 빌드된 JavaScript
*.swp                            # Vim swap 파일
*.swo
*~
.DS_Store                        # macOS 파일

# 로그 파일
*.log

# 임시 파일
*.tmp
*.bak
*.backup
```
{: file=".gitignore" }

## 6. 블로그 게시물 작성 가이드

### 새 게시물 작성하기

#### 1. 파일 생성

`_posts/` 디렉토리에 다음 형식으로 파일을 생성합니다:

```
_posts/YYYY-MM-DD-title-in-english.md
```

**예시:**
```
_posts/2025-01-05-how-to-use-docker.md
```

#### 2. Front Matter 작성

파일 상단에 YAML 형식의 메타데이터를 작성합니다:

```yaml
---
title: "Docker 기초부터 실전까지"           # 게시물 제목
author: KeunyoungSong                     # 작성자 ID (_config.yml의 authors에 정의)
date: 2025-01-05 14:30:00 +0900          # 작성 날짜 및 시간
categories: [개발, DevOps]                # 카테고리 (최대 2개 권장)
tags: [docker, container, deployment]    # 태그 (여러 개 가능)
---
```

**필수 필드:**
- `title`: 게시물 제목
- `author`: 작성자 (authors에 정의된 ID)
- `date`: 날짜 및 시간

**선택 필드:**
- `categories`: 카테고리 (계층 구조 가능)
- `tags`: 태그
- `pin`: true로 설정 시 상단 고정
- `image`: 대표 이미지 URL

#### 3. 본문 작성

Front Matter 아래에 Markdown으로 본문을 작성합니다. 기본적인 마크다운 문법을 사용하여 제목, 본문, 코드 블록, 링크 등을 작성할 수 있습니다.

**마크다운 문법 예시:**

- `# H1 제목`, `## H2 제목`, `### H3 제목` - 제목
- `**굵은 글씨**`, `*기울임*` - 텍스트 강조
- `- 항목` 또는 `1. 항목` - 목록
- `[링크 텍스트](URL)` - 링크
- ` ```언어` + 코드 + ` ``` ` - 코드 블록

- `![이미지 설명](/path/to/image.jpg)` - 이미지
- `> 인용문` - 인용
- `` `인라인 코드` `` - 인라인 코드
- 표 작성: 파이프(`|`)와 하이픈(`-`)으로 구성

### 로컬 테스트

배포하기 전에 로컬에서 미리 확인할 수 있습니다.

#### 1. 의존성 설치 (최초 1회)

```bash
bundle install
```

#### 2. 로컬 서버 실행

```bash
bundle exec jekyll serve
```

#### 3. 브라우저에서 확인

```
http://localhost:4000
```

**실시간 수정 확인:**
- 파일을 수정하면 자동으로 재빌드
- 브라우저를 새로고침하면 변경사항 반영
- `_config.yml` 변경 시에는 서버 재시작 필요

**서버 종료:**
```bash
Ctrl + C
```

### 배포하기

로컬 테스트가 완료되면 GitHub에 push합니다.

```bash
# 변경사항 확인
git status

# 파일 추가
git add _posts/2025-01-05-new-post.md

# 커밋
git commit -m "포스트 추가: Docker 기초부터 실전까지"

# 원격 저장소에 푸시
git push origin main
```

**배포 과정:**

```mermaid
graph LR
    A[git push] --> B[GitHub Actions 실행<br/>30초~1분]
    B --> C[배포 완료]
    C --> D[웹사이트 확인<br/>1-2분 후]

    style A fill:#e1f5fe,color:#0b0f14
    style B fill:#fff9c4,color:#0b0f14
    style C fill:#c8e6c9,color:#0b0f14
    style D fill:#c8e6c9,color:#0b0f14
```

**확인 방법:**
1. GitHub 저장소 > Actions 탭 > 초록색 체크 확인
2. https://romantic-coders.github.io 접속하여 새 게시물 확인

## 7. 트러블슈팅 팁

### Actions 실패 시 로그 확인 방법

#### 1. GitHub 웹에서 확인

```
저장소 > Actions 탭 > 실패한 워크플로우 클릭 > build 또는 deploy 클릭
```

#### 2. 명령줄에서 확인 (GitHub CLI 사용)

```bash
# 최근 워크플로우 실행 목록
gh run list --limit 5

# 특정 워크플로우 상세 보기
gh run view [RUN_ID]

# 실패한 로그만 보기
gh run view [RUN_ID] --log-failed
```

### 자주 발생하는 에러와 해결법

#### 에러 1: "Bundler could not find compatible versions"

**원인:** Gemfile의 gem 버전 충돌

**해결:**
```bash
# 로컬에서 Gemfile.lock 삭제 후 재생성
rm Gemfile.lock
bundle install
git add Gemfile.lock
git commit -m "Update Gemfile.lock"
git push
```

#### 에러 2: "Liquid Exception: undefined method"

**원인:** 플러그인 누락 또는 Liquid 템플릿 문법 오류

**해결:**
1. 에러 메시지에서 누락된 플러그인 확인
2. Gemfile과 _config.yml에 플러그인 추가
3. 로컬에서 `bundle install` 실행 후 테스트

#### 에러 3: "Could not read file"

**원인:** 파일 경로 오류 또는 인코딩 문제

**해결:**
1. 파일 경로가 올바른지 확인
2. 파일이 UTF-8 인코딩인지 확인
3. 파일명에 특수문자가 있는지 확인

#### 에러 4: "GitHub Pages build failed"

**원인:** _config.yml 문법 오류

**해결:**
1. YAML 문법 검증: https://www.yamllint.com/
2. 들여쓰기 확인 (스페이스 2칸)
3. 콜론(:) 뒤에 공백 확인

### 의존성 충돌 해결 전략

#### 1. 버전 범위 넓히기

```ruby
# 엄격한 버전 (충돌 가능성 높음)
gem "jekyll", "4.3.0"

# 유연한 버전 (권장)
gem "jekyll", "~> 4.3"  # 4.3.x 허용 (4.4는 불가)
```

#### 2. 호환성 확인

공식 문서에서 지원 버전 확인:
- Jekyll: https://jekyllrb.com/
- Chirpy: https://github.com/cotes2020/jekyll-theme-chirpy

#### 3. 최소 버전 명시

```ruby
# 특정 버전 이상
gem "jekyll", ">= 4.3"
```

### 디버깅 도구

#### Jekyll 빌드 디버그 모드

```bash
bundle exec jekyll build --verbose --trace
```

#### 의존성 트리 확인

```bash
bundle list
```

#### 특정 gem 버전 확인

```bash
bundle info jekyll
```

## 8. 배운 점과 느낀 점

### Jekyll 생태계에 대한 이해

Jekyll을 처음 접했을 때는 단순히 "Markdown을 HTML로 바꿔주는 도구" 정도로만 생각했습니다. 하지만 실제로 블로그를 구축하면서 Jekyll이 단순한 변환기가 아니라 **완전한 정적 사이트 생성 플랫폼**임을 깨달았습니다.

**핵심 개념:**
- **Collections**: 포스트, 페이지, 커스텀 컬렉션으로 콘텐츠 구조화
- **Liquid 템플릿**: 동적 콘텐츠 생성의 강력함
- **플러그인 시스템**: 기능 확장의 무한한 가능성
- **Front Matter**: 메타데이터 중심의 콘텐츠 관리

특히 `_config.yml`의 defaults 설정을 통해 모든 포스트에 공통 설정을 적용할 수 있다는 점이 인상적이었습니다. 이는 대규모 블로그 운영 시 일관성을 유지하는 데 큰 도움이 됩니다.

### GitHub Actions의 강력함

GitHub Actions는 단순히 "자동 배포 도구"를 넘어서는 강력한 CI/CD 플랫폼입니다.

**인상 깊었던 점:**
1. **Matrix 빌드**: 여러 환경에서 동시 테스트 가능
2. **Artifact 시스템**: 빌드 결과물을 다음 Job에서 재사용
3. **Caching**: 의존성 캐싱으로 빌드 속도 최적화
4. **Secrets 관리**: 민감한 정보를 안전하게 관리

특히 `bundler-cache: true` 한 줄로 빌드 시간을 절반으로 줄일 수 있었던 점이 놀라웠습니다.

---

**참고 자료:**
- [Jekyll 공식 문서](https://jekyllrb.com/docs/)
- [Chirpy 테마 공식 문서](https://github.com/cotes2020/jekyll-theme-chirpy/wiki)
- [GitHub Pages 문서](https://docs.github.com/en/pages)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
