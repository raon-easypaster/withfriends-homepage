# 사단법인 위드프렌즈 홈페이지

빌드 도구 없이 동작하는 반응형 정적 홈페이지입니다.
HTML · CSS · JavaScript 파일만으로 이루어져 있어 일반 웹호스팅에 그대로 올리면 됩니다.

---

## 1. 폴더 구조

```
index.html            메인
about.html            위드프렌즈 소개 (인사말 · 미션과 비전 · 연혁 · 조직도 · 오시는 길)
business.html         주요사업
centers.html          운영시설 5개소 목록 (유형 필터)
center-detail.html    센터 상세 — 주소 뒤에 ?id=센터아이디 를 붙여 사용
stories.html          활동소식 (센터 이야기 · 프로그램 이야기 · 공지사항 · 보도 및 자료)
support.html          참여·후원
privacy.html          개인정보처리방침  ← 법인이 확정한 전문을 넣어 주세요
terms.html            이용약관          ← 법인이 확정한 전문을 넣어 주세요
robots.txt / sitemap.xml

assets/css/style.css  전체 디자인 (색상은 :root 의 CSS 변수로 관리)
assets/js/site.js     공통 헤더·푸터·카드·후원 버튼 처리
assets/images/        로고, 자리표시 그림, 센터 상징 이미지, 활동 사진

data/site.js          ★ 체리 기부 주소, 법인 정보, 통계, 주요사업, 연혁
data/centers.js       ★ 센터 5개소 정보
data/stories.js       ★ 활동소식 · 공지사항
```

내용은 대부분 `data/` 폴더의 세 파일만 고치면 바뀝니다.

---

## 2. 로컬에서 보는 방법

가장 간단한 방법은 `index.html` 을 더블클릭하는 것입니다.
다만 브라우저에 따라 제한이 있을 수 있으니, 아래처럼 간단한 서버를 띄우는 쪽을 권합니다.

```bash
cd "위드프렌즈 홈페이지" && python3 -m http.server 4173
```

그다음 브라우저에서 `http://localhost:4173` 으로 접속합니다. 종료는 `Ctrl+C` 입니다.

---

## 3. ★ 체리 기부 주소 넣기 (가장 중요)

1. `data/site.js` 파일을 엽니다.
2. 파일 **맨 위쪽 25번째 줄 부근**의 아래 한 줄을 찾습니다.

```js
var CHERRY_DONATION_URL = "";
```

3. 따옴표 안에 체리에서 발급받은 **실제** 위드프렌즈 기부 페이지 주소를 넣습니다.

```js
var CHERRY_DONATION_URL = "https://cherry.charity/실제주소";
```

4. 저장하면 사이트 전체의 후원 버튼이 한 번에 연결됩니다.

**비워 두면**: 모든 후원 버튼이 눌리지 않게 잠기고 "체리 기부 페이지 주소 준비 중" 안내가 나옵니다.
잘못된 주소로 이동하는 사고가 나지 않습니다. **주소를 추측해서 넣지 마세요.**

---

## 4. 센터 사진 바꾸기

1. 사진 파일을 `assets/images/centers/` 폴더에 넣습니다. (예: `mindeulle-01.jpg`)
2. `data/centers.js` 에서 해당 센터의 `photo` 값을 채웁니다.

```js
photo: "assets/images/centers/mindeulle-01.jpg",
photoAlt: "민들레 지역아동센터에서 아이들이 책을 읽는 모습",
```

3. 여러 장을 올리려면 같은 센터의 `gallery` 에 추가합니다.

```js
gallery: [
  { src: "assets/images/centers/mindeulle-02.jpg", alt: "요리 활동 모습" },
  { src: "assets/images/centers/mindeulle-03.jpg", alt: "체육 활동 모습" }
],
```

메인 화면의 큰 사진은 `assets/images/hero.jpg` 를 넣은 뒤
`index.html` 의 `assets/images/placeholder-hero.svg` 부분을 바꾸면 됩니다.

> **조직도**: `about.html` 의 `#org` 영역에 있습니다. 총회·이사장·감사·이사회·사무국은 HTML에 직접 적혀 있고,
> 사무국 아래 운영시설 5개소는 `data/centers.js` 에서 **자동으로 그려집니다**.
> 센터를 더하거나 빼면 조직도에도 바로 반영되므로 따로 손볼 필요가 없습니다.

> **사진 게시 전 확인**: 아동 사진은 보호자 게시 동의를 받은 것만 사용하세요.
> 사진 설명(alt)에 이름·학교 등 개인을 특정할 수 있는 내용을 쓰지 마세요.

---

## 5. 활동소식 · 공지사항 올리기

`data/stories.js` 의 `WF_POSTS` 배열 **맨 앞**에 아래 형식으로 붙여 넣습니다.

```js
{
  category: "center",                        // center | program | notice | press
  center: "민들레 지역아동센터",
  tags: ["문화체험"],
  title: "글 제목",
  summary: "두 줄 정도의 짧은 소개",
  date: "2026-09-01",
  image: "assets/images/stories/파일명.jpg",  // 없으면 ""
  imageAlt: "사진 설명",
  url: ""                                    // 원문 링크가 있으면 주소
},
```

화면 구성을 보여 주려고 넣어 둔 **“샘플” 글**은 실제 글을 올린 뒤
`WF_SHOW_SAMPLE_POSTS` 값을 `false` 로 바꿔 숨겨 주세요.

---

## 6. 배포할 때 할 일

1. **체리 주소 입력** — `data/site.js` (위 3번)
2. **샘플 글 끄기** — `data/stories.js` 의 `WF_SHOW_SAMPLE_POSTS = false`
3. **도메인 주소 바꾸기** — 아래 위치의 `http://www.withfriends.or.kr` 를 실제 주소로 교체
   - 각 HTML 파일의 `<link rel="canonical">` 와 `og:url`, `og:image`
   - `robots.txt` 의 `Sitemap:` 줄
   - `sitemap.xml` 의 모든 `<loc>`
   - `data/site.js` 의 `SITE_BASE_URL`
4. **공유용 대표 이미지** — 1200×630 크기로 만들어 `assets/images/og-image.jpg` 에 저장
5. **개인정보처리방침 · 이용약관** 전문을 `privacy.html`, `terms.html` 에 입력
6. 파일 전체를 호스팅의 웹 루트에 업로드 (별도 빌드 과정 없음)
7. HTTPS 적용을 권장합니다.

---

## 7. 아직 확인되지 않아 비워 둔 정보

| 항목 | 위치 |
| --- | --- |
| 체리 기부 페이지 주소 | `data/site.js` → `CHERRY_DONATION_URL` |
| 다함께돌봄센터 2개소의 주소·전화·정원·운영시간·소개 | `data/centers.js` → `hillstate`, `yeokgok` |
| 센터별 주요 프로그램, 교통편 | `data/centers.js` → `programs`, `transit` |
| 2020년 이후 연혁 | `data/site.js` → `WF_HISTORY` |
| 이용 아동 수 · 후원자 수 · 프로그램 수 | `data/site.js` → `WF_STATS` (값이 `null` 이면 화면에 안 보임) |
| 공식 미션·비전 선언문 | `about.html` → `#vision` 영역 |
| 센터 이용 절차·서류, 자원봉사 모집 안내 | `centers.html` → `#guide`, `support.html` → `#volunteer` |
| 개인정보처리방침 · 이용약관 전문 | `privacy.html`, `terms.html` |
| SNS 주소 | `data/site.js` → `WF_ORG.sns` |

값을 비워 두면 화면에 **“정보 준비 중”** 으로 표시됩니다.
확인되지 않은 정보를 임의로 채우지 마세요.

---

## 8. 현재 배포 상태

| 항목 | 주소 |
| --- | --- |
| 미리보기 사이트 | https://withfriends-homepage.vercel.app |
| 소스 저장소 | https://github.com/raon-easypaster/withfriends-homepage |

GitHub 저장소가 Vercel에 연결되어 있어, `main` 브랜치에 변경 사항을 올리면 자동으로 다시 배포됩니다.

```bash
git add -A && git commit -m "내용 수정" && git push
```

`withfriends-homepage.vercel.app` 는 확인용 임시 주소입니다.
실제 운영은 `www.withfriends.or.kr` 도메인을 Vercel 프로젝트에 연결한 뒤,
위 6번의 도메인 주소 교체 작업을 함께 진행해 주세요.
