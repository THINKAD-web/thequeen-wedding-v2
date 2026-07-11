# 더퀸 웨딩홀 콘텐츠 발행 가이드

Markdown 파일을 `content/` 폴더에 추가하고 커밋하면, Vercel 빌드 시 자동으로 HTML 페이지·목록·RSS·sitemap·홈 최신 글 섹션이 갱신됩니다.

## 새 글 발행 방법

1. `content/{카테고리}/` 아래에 `.md` 파일 작성
2. frontmatter와 본문 작성 (아래 규격 참고)
3. `git add` → `git commit` → `git push`
4. 배포가 끝나면 `https://thequeenwedding.kr/{카테고리}/{slug}` 에서 확인

로컬에서 미리 보려면:

```bash
npm install
npm run build:content
npm run dev
```

브라우저에서 `http://localhost:3000/news` 등으로 확인합니다.

## 디렉토리 구조

| 폴더 | 카테고리 | URL prefix |
|------|----------|------------|
| `content/news/` | 더퀸 소식 | `/news` |
| `content/guide/` | 웨딩 가이드 | `/guide` |
| `content/stories/` | 리얼 웨딩 | `/stories` |
| `content/dining/` | 퀸즈테이블 | `/dining` |

## 파일명 규칙

```
content/{category}/{YYYY-MM-DD}-{slug}.md
```

예: `content/news/2026-07-12-ua-to-thequeen.md` → URL `/news/ua-to-thequeen`

## Frontmatter 필드

```yaml
---
title: "글 제목"
description: "목록·OG·RSS에 쓰이는 한 줄 요약"
date: 2026-07-12          # YYYY-MM-DD
category: news            # news | guide | stories | dining
slug: ua-to-thequeen      # URL 슬러그 (영문·하이픈)
thumbnail: /images/content/hero.jpg
keywords: [포항 웨딩홀, 포항 예식장]
draft: false              # true면 빌드에서 제외
---
```

| 필드 | 필수 | 설명 |
|------|------|------|
| `title` | ✓ | 페이지 `<title>` 및 본문 H1 |
| `description` | ✓ | meta description, OG, RSS 요약 |
| `date` | ✓ | 발행일 (sitemap `lastmod`, 정렬 기준) |
| `category` | ✓ | `news`, `guide`, `stories`, `dining` 중 하나 |
| `slug` | ✓ | URL 경로 (`/{category}/{slug}`) |
| `thumbnail` | 권장 | 카드·OG 이미지 (절대 URL 또는 `/images/...`) |
| `keywords` | 선택 | SEO 키워드 배열 |
| `draft` | 선택 | `true`면 빌드 제외 (기본: 발행) |

## 본문 작성

- 표준 Markdown 사용 (h2~h4, 리스트, 인용, 링크, 이미지)
- h1은 frontmatter `title`이 자동 적용되므로 본문은 **h2부터** 시작 권장

## 이미지

- 콘텐츠 전용 이미지: `/images/content/` 에 저장
- Markdown 본문 예시: `![설명](/images/content/example.jpg)`
- frontmatter `thumbnail`은 목록 카드·OG·JSON-LD에 사용

기존 사이트 이미지를 임시로 쓸 때는 `https://i.ibb.co/...` 형태의 절대 URL도 가능합니다.

## 빌드 산출물 (수동 편집 금지)

다음 파일은 `npm run build:content` 가 자동 생성합니다. 직접 수정하지 마세요.

- `{category}/index.html`, `{category}/{slug}.html`
- `rss.xml`
- `sitemap.xml` (기존 URL 유지 + 콘텐츠 URL 추가)
- `index.html` 내 `<!-- LATEST_POSTS_START -->` ~ `<!-- LATEST_POSTS_END -->` 구간

## RSS

- 피드 URL: `/rss.xml`
- 최신 20건, RSS 2.0
- 사이트 전체 `<head>`에 RSS alternate 링크 포함

## 문의

콘텐츠 파이프라인 관련 문의는 저장소 관리자에게 연락해 주세요.
