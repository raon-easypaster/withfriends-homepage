/* ==========================================================================
   활동소식 데이터 (센터 이야기 · 프로그램 이야기 · 공지사항 · 보도 및 자료)
   --------------------------------------------------------------------------
   [글 하나 추가하는 방법]
   아래 WF_POSTS 배열의 맨 앞에 아래 형식으로 한 덩어리를 붙여 넣으세요.

     {
       category: "center",                       // center | program | notice | press
       center: "민들레 지역아동센터",              // 해당 없으면 "" 로 두세요
       tags: ["문화체험"],                        // 활동 분야 태그 (여러 개 가능)
       title: "글 제목",
       summary: "두 줄 정도의 짧은 소개",
       date: "2026-09-01",                       // YYYY-MM-DD
       image: "assets/images/stories/파일명.jpg", // 없으면 "" (자리표시 이미지 표시)
       imageAlt: "사진 설명 (화면 낭독기용)",
       url: ""                                   // 원문 링크가 있으면 주소, 없으면 ""
     },

   ★ 개인정보 보호
     - 아동의 실명, 학교, 주소, 가정환경, 건강정보를 쓰지 마세요.
     - 사진은 보호자 게시 동의를 받은 것만 올려 주세요.
   ========================================================================== */

/* --------------------------------------------------------------------------
   샘플 글 표시 여부
   true  : 아래 "[샘플]" 로 시작하는 예시 글이 화면에 보입니다. (디자인 확인용)
   false : 샘플이 모두 숨겨지고 실제 글만 보입니다. ★실제 운영 시 false 로 바꾸세요.
   -------------------------------------------------------------------------- */
var WF_SHOW_SAMPLE_POSTS = true;

var WF_POST_CATEGORIES = [
  { id: "all",     label: "전체" },
  { id: "center",  label: "센터 이야기" },
  { id: "program", label: "프로그램 이야기" },
  { id: "notice",  label: "공지사항" },
  { id: "press",   label: "보도 및 자료" }
];

var WF_POSTS = [

  /* ====================================================================
     아래는 기존 홈페이지 공지사항 게시판에서 그대로 옮겨 온 실제 글입니다.
     (출처: http://www.withfriends.or.kr/notice)
     ==================================================================== */
  { category: "notice", center: "", tags: ["공시"], title: "2024년 결산서류 등 재공시",
    summary: "", date: "2025-10-01", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=25" },

  { category: "notice", center: "", tags: ["공시"], title: "2024년 연간기부금모금액 및 활용실적",
    summary: "", date: "2025-06-11", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=24" },

  { category: "notice", center: "", tags: ["공시"], title: "2024년 사업실적 및 2025년 사업계획 공고",
    summary: "", date: "2025-02-28", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=23" },

  { category: "notice", center: "", tags: ["공시"], title: "2023년도 연간기부금 모금액 활용실적 공시",
    summary: "", date: "2024-04-26", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=22" },

  { category: "notice", center: "", tags: ["공시"], title: "2023년 사업실적 및 2024년 사업계획 공시",
    summary: "", date: "2024-02-29", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=21" },

  { category: "notice", center: "", tags: ["공시"], title: "2022년 연간 기부금 모금 활용 실적 공개",
    summary: "", date: "2023-04-17", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=20" },

  { category: "notice", center: "", tags: ["공시"], title: "2022년도 사업실적 및 2023년도 사업계획 공시",
    summary: "", date: "2023-02-27", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=19" },

  { category: "notice", center: "", tags: ["공시"], title: "2021년 연간 기부금 모금액 및 활용실적 명세서 공시",
    summary: "", date: "2022-03-31", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=18" },

  { category: "notice", center: "", tags: ["공시"], title: "사)위드프렌즈 2021년도 사업실적 및 2022년도 사업계획",
    summary: "", date: "2022-02-25", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=17" },

  { category: "notice", center: "", tags: ["공시"], title: "위드프렌즈 2020년 사업 결산 및 2021년 사업 계획",
    summary: "", date: "2021-03-30", image: "", imageAlt: "",
    url: "http://www.withfriends.or.kr/notice/content?idx=15" },

  /* ====================================================================
     아래는 화면 구성을 확인하기 위한 "샘플" 글입니다.
     ★ 실제 내용이 아닙니다. 실제 글로 교체하거나
       위의 WF_SHOW_SAMPLE_POSTS 를 false 로 바꿔 숨기세요.
     ★ 아동 개인정보가 들어가지 않도록 일부러 일반적인 문장만 썼습니다.
     ==================================================================== */
  { sample: true, category: "center", center: "센터명을 입력하세요", tags: ["센터 일상"],
    title: "[샘플] 센터 이야기 제목이 들어가는 자리입니다",
    summary: "센터에서 있었던 일을 두세 줄로 소개하는 자리입니다. data/stories.js 파일에서 내용을 바꿀 수 있습니다.",
    date: "2026-09-01", image: "", imageAlt: "", url: "" },

  { sample: true, category: "program", center: "센터명을 입력하세요", tags: ["프로그램"],
    title: "[샘플] 프로그램 이야기 제목이 들어가는 자리입니다",
    summary: "진행한 프로그램의 목적과 아이들의 반응을 짧게 적는 자리입니다.",
    date: "2026-08-20", image: "", imageAlt: "", url: "" },

  { sample: true, category: "center", center: "센터명을 입력하세요", tags: ["문화체험"],
    title: "[샘플] 활동 사진과 함께 소식을 전해 보세요",
    summary: "사진은 assets/images/stories/ 폴더에 넣고 image 항목에 경로를 적으면 됩니다.",
    date: "2026-08-05", image: "", imageAlt: "", url: "" },

  { sample: true, category: "press", center: "", tags: ["보도"],
    title: "[샘플] 보도 및 자료 제목이 들어가는 자리입니다",
    summary: "언론 보도나 배포 자료를 소개하고 원문 링크를 연결할 수 있습니다.",
    date: "2026-07-15", image: "", imageAlt: "", url: "" }
];

/* --------------------------------------------------------------------------
   자원봉사 · 협력 문의 안내
   확인된 별도 연락처가 없어 법인 대표 연락처를 사용합니다.
   전용 연락처가 생기면 아래 값을 바꾸세요.
   -------------------------------------------------------------------------- */
var WF_PARTICIPATION = {
  volunteerContact: "",   // 비워 두면 법인 대표 전화·이메일이 표시됩니다.
  partnerContact: ""
};
