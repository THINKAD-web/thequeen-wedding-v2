# 시즌 메뉴·행사 추가 가이드

## 1. 데이터 수정

`data/seasonal-items.js`에 항목을 추가하거나 기존 객체의 필드를 채웁니다.

## 2. 게시 조건

- `published: true` **그리고** `verified: true`일 때만 사이트·소스·JSON-LD에 노출됩니다.
- `summary`, `price_note`, 기간, 이미지 URL은 **확인된 내용만** 입력합니다.

## 3. 빌드

```bash
npm run build:content
```

## 4. 배포

변경된 HTML·`data/instagram-oembed-cache.json`을 커밋 후 Vercel Preview/Production에 배포합니다.

## 5. 확인

- `/queens-table` — 기간 내 항목만 「이달의 시즌 메뉴·행사」
- `/dining` — 퀸즈테이블 탭 카드(종료 시 `종료` 배지)
- `/dining/seasonal-{id}` — 상세(인스타 링크·선택적 oEmbed)

---

## 입력 템플릿 (예시)

```javascript
{
  id: 'fall-eel-2026',
  type: 'menu', // 'menu' | 'event'
  title: '가을 전어',
  period_start: '2026-10-01',
  period_end: '2026-10-31',
  summary: '한 줄 소개 (근거 있는 문장만)',
  tier: '퀸즈 블루', // 또는 '퀸즈 로얄', 없으면 null
  price_note: null, // 가격 확정 시만
  images: ['https://...existing-site-image.jpg'],
  instagram_url: 'https://www.instagram.com/thequeen_pohang/p/XXXX/', // 선택
  verified: true,
  published: true,
},
```

## 이미지

- 사이트에 이미 쓰는 URL(`data/site-images.js` 등) 또는 직접 제공한 경로만 사용합니다.
- `alt` 텍스트는 빌드 시 제목으로 채워집니다.

## 인스타그램

- `@thequeen_pohang` 또는 `@queens_table.official` 게시물 URL만 허용됩니다.
- oEmbed는 빌드 시 캐시되며, 실패 시 링크 카드만 표시됩니다.

## (제안) 더 쉬운 등록

파일 기반이므로 **매번 `build:content` + 배포**가 필요합니다. DB·관리자 UI로 등록하려면 별도 승인 후 `/admin` 확장이 필요합니다(이번 범위 아님).
