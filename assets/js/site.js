/* ==========================================================================
   사단법인 위드프렌즈 — 공통 스크립트
   · 헤더 / 푸터 / 모바일 메뉴
   · 후원(체리) 버튼 안전 처리
   · 센터 카드 · 소식 카드 등 재사용 컴포넌트
   빌드 도구 없이 바로 동작합니다. (ES5 문법 + 전역 함수)
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ 유틸 */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function has(v) { return v !== null && v !== undefined && String(v).trim() !== ""; }
  function hasList(v) { return !!(v && v.length); }

  /* 값이 없으면 "정보 준비 중" 으로 표시 */
  function orTBD(v) { return has(v) ? esc(v) : '<span class="tbd" aria-label="정보 준비 중"></span>'; }

  /* 상대 경로 깊이 (모든 페이지가 루트에 있으므로 "" 고정) */
  var BASE = "";

  /* ------------------------------------------------------- 분석 이벤트 훅 */
  /* 구글 애널리틱스(gtag) 또는 GTM(dataLayer)이 설치되어 있으면 자동 전송됩니다.
     설치되어 있지 않으면 아무 일도 일어나지 않습니다. */
  window.wfTrack = function (eventName, params) {
    params = params || {};
    try {
      if (typeof window.gtag === "function") { window.gtag("event", eventName, params); }
      if (window.dataLayer && typeof window.dataLayer.push === "function") {
        window.dataLayer.push(Object.assign({ event: eventName }, params));
      }
    } catch (e) { /* 분석 도구 오류가 사이트를 멈추지 않도록 무시 */ }
  };

  /* ================================================================== 아이콘
     간결한 선형 아이콘 (24x24, stroke 방식)                                */
  var ICONS = {
    pin:       '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    info:      '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.9"/>',
    news:      '<path d="M4 5.5h12.5v13H6a2 2 0 0 1-2-2z"/><path d="M16.5 8.5H20v8a2 2 0 0 1-2 2h-1.5z"/><path d="M7 9h6M7 12.5h6M7 15.5h3.5"/>',
    heart:     '<path d="M12 20s-7.2-4.4-7.2-9.4A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.2 2.8C19.2 15.6 12 20 12 20z"/>',
    phone:     '<path d="M6 3.8h3l1.6 4-2 1.5a12 12 0 0 0 5.9 5.9l1.5-2 4 1.6v3a1.8 1.8 0 0 1-2 1.8A15.6 15.6 0 0 1 4.2 5.8 1.8 1.8 0 0 1 6 3.8z"/>',
    route:     '<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.4 6H14a3.4 3.4 0 0 1 0 6.8h-4a3.4 3.4 0 0 0 0 6.8h5.6"/>',
    arrow:     '<path d="M5 12h13M13 6.5 18.5 12 13 17.5"/>',
    handshake: '<path d="M3.5 12.5 7 9l3 2.5 3-2.5 3.5 3.5"/><path d="M10 14.5 12 16.5l2-2 2 2"/><path d="M2.5 9.5 6 6h5l1.5 1.5L14 6h4l3.5 3.5"/>',
    star:      '<path d="m12 4.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"/>',
    search:    '<circle cx="11" cy="11" r="6.2"/><path d="m15.6 15.6 4 4"/>',
    tent:      '<path d="m12 4 8 15H4z"/><path d="m12 4-4 15M12 4l4 15"/>',
    home:      '<path d="m4 11 8-6.5 8 6.5"/><path d="M6.2 9.8V19h11.6V9.8"/><path d="M10 19v-4.4h4V19"/>',
    community: '<circle cx="8.2" cy="9" r="2.6"/><circle cx="16" cy="9.6" r="2.2"/><path d="M3.6 18.5c0-2.7 2.1-4.4 4.6-4.4s4.6 1.7 4.6 4.4"/><path d="M15 14.2c2.3 0 4.4 1.5 4.4 4.3"/>',
    shield:    '<path d="M12 3.8 19 6.3v5.2c0 4.1-2.9 7.3-7 8.7-4.1-1.4-7-4.6-7-8.7V6.3z"/><path d="m9.2 12.2 2 2 3.6-3.8"/>',
    sprout:    '<path d="M12 20v-7"/><path d="M12 13C12 9.7 9.4 7.2 6 7.2c0 3.3 2.6 5.8 6 5.8z"/><path d="M12 13c0-3 2.4-5.4 5.5-5.4 0 3-2.4 5.4-5.5 5.4z"/>',
    mail:      '<rect x="3.5" y="5.5" width="17" height="13" rx="2.2"/><path d="m4 7 8 5.4L20 7"/>',
    people:    '<circle cx="12" cy="8" r="3"/><path d="M5.5 19.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/>',
    doc:       '<path d="M6 3.8h7l5 5v11.4H6z"/><path d="M13 3.8V9h5"/><path d="M9 13h6M9 16.3h6"/>'
  };
  window.wfIcon = function (name, cls) {
    var body = ICONS[name] || ICONS.info;
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
           body + "</svg>";
  };

  /* ============================================================= 내비게이션 */
  var NAV = [
    { id: "about",    label: "위드프렌즈 소개", href: "about.html",
      sub: [
        { label: "인사말",     href: "about.html#greeting" },
        { label: "미션과 비전", href: "about.html#vision" },
        { label: "연혁",       href: "about.html#history" },
        { label: "조직도",     href: "about.html#org" },
        { label: "오시는 길",  href: "about.html#map" }
      ] },
    { id: "business", label: "주요사업",   href: "business.html", sub: [] },
    { id: "centers",  label: "운영시설",   href: "centers.html",
      sub: [
        { label: "전체 5개소",      href: "centers.html" },
        { label: "지역아동센터",    href: "centers.html?type=community" },
        { label: "다함께돌봄센터",  href: "centers.html?type=dahamkke" }
      ] },
    { id: "stories",  label: "활동소식",   href: "stories.html",
      sub: [
        { label: "센터 이야기",     href: "stories.html?cat=center" },
        { label: "프로그램 이야기", href: "stories.html?cat=program" },
        { label: "공지사항",        href: "stories.html?cat=notice" },
        { label: "보도 및 자료",    href: "stories.html?cat=press" }
      ] },
    { id: "support",  label: "참여·후원", href: "support.html",
      sub: [
        { label: "후원 안내",       href: "support.html#donate" },
        { label: "자원봉사",        href: "support.html#volunteer" },
        { label: "기관 및 기업 협력", href: "support.html#partner" }
      ] }
  ];

  /* ============================================================= 후원 버튼
     체리 주소가 비어 있으면 절대 이동시키지 않습니다.                      */
  function cherryUrl() {
    return (typeof CHERRY_DONATION_URL === "string") ? CHERRY_DONATION_URL.trim() : "";
  }
  window.wfCherryReady = function () { return cherryUrl().length > 0; };

  /* data-donate 속성이 붙은 모든 <a> 를 안전하게 설정 */
  function initDonateLinks(root) {
    var url = cherryUrl();
    $$("[data-donate]", root || document).forEach(function (el) {
      /* 버튼 글자에서 화살표 기호를 뺀 이름 (화면 낭독기 안내용) */
      var name = (el.textContent || "후원하기").replace(/[\u2197\s]+$/g, "").trim() || "후원하기";

      if (url) {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
        el.removeAttribute("aria-disabled");
        el.removeAttribute("role");
        el.removeAttribute("title");
        el.classList.remove("btn--disabled");
        el.setAttribute("aria-label", name + " — 외부 사이트인 체리 기부 플랫폼이 새 창에서 열립니다");
      } else {
        el.removeAttribute("href");
        el.removeAttribute("target");
        el.setAttribute("role", "link");
        el.setAttribute("aria-disabled", "true");
        el.classList.add("btn--disabled");
        el.setAttribute("title", "체리 기부 페이지 주소가 아직 등록되지 않았습니다.");
        el.setAttribute("aria-label", name + " — 체리 기부 페이지 주소 준비 중이라 지금은 연결되지 않습니다");
      }

      /* 클릭 처리는 한 번만 연결하고, 주소는 누르는 시점에 다시 확인합니다. */
      if (!el.dataset.wfBound) {
        el.dataset.wfBound = "1";
        el.addEventListener("click", function (e) {
          var now = cherryUrl();
          if (!now) { e.preventDefault(); }
          window.wfTrack("donation_cta_click", {
            location: el.getAttribute("data-donate-location") || "unknown",
            destination: now || "not_configured"
          });
        });
      }
    });

    /* 주소가 없을 때만 보이는 안내 문구 */
    $$("[data-donate-pending]").forEach(function (el) { el.hidden = !!url; });
  }
  window.wfInitDonateLinks = initDonateLinks;

  /* 후원 버튼 HTML 생성기 (재사용 컴포넌트) */
  window.wfDonateButton = function (opts) {
    opts = opts || {};
    var cls = "btn " + (opts.variant || "btn--primary") + (opts.size ? " " + opts.size : "") + (opts.block ? " btn--block" : "");
    return '<a class="' + cls + '" data-donate data-donate-location="' + esc(opts.location || "unknown") + '">' +
           (opts.label || "체리에서 안전하게 후원하기") +
           ' <span class="btn__ext" aria-hidden="true">↗</span></a>';
  };

  /* ================================================================== 헤더 */
  function renderHeader() {
    var mount = $("#site-header");
    if (!mount) return;
    var current = document.body.getAttribute("data-page") || "";

    var gnb = NAV.map(function (n) {
      return '<li><a class="gnb__link" href="' + BASE + n.href + '"' +
             (n.id === current ? ' aria-current="page"' : "") + ">" + esc(n.label) + "</a></li>";
    }).join("");

    var mob = NAV.map(function (n) {
      var subs = n.sub.length
        ? '<ul class="mobile-nav__sub">' + n.sub.map(function (s) {
            return '<li><a class="mobile-nav__link" href="' + BASE + s.href + '" style="min-height:48px;font-size:.95rem;font-weight:600;background:transparent;box-shadow:none;border-color:transparent;padding-left:1.9rem">' +
                   esc(s.label) + "</a></li>";
          }).join("") + "</ul>"
        : "";
      return '<li><a class="mobile-nav__link" href="' + BASE + n.href + '"' +
             (n.id === current ? ' aria-current="page"' : "") + ">" + esc(n.label) +
             '<span class="chev" aria-hidden="true">›</span></a>' + subs + "</li>";
    }).join("");

    mount.innerHTML =
      '<div class="wrap site-header__inner">' +
        '<a class="brand" href="' + BASE + 'index.html">' +
          '<img src="' + BASE + 'assets/images/logo-withfriends.png" alt="사단법인 위드프렌즈 홈으로">' +
        "</a>" +
        '<nav class="gnb" aria-label="주요 메뉴"><ul class="gnb__list">' + gnb + "</ul></nav>" +
        '<div class="header-actions">' +
          '<a class="btn btn--outline btn--sm" href="' + BASE + 'centers.html">' + window.wfIcon("pin") + " 센터 찾기</a>" +
          window.wfDonateButton({ location: "header", size: "btn--sm", label: "후원하기" }) +
          '<button class="btn-menu" type="button" aria-expanded="false" aria-controls="mobile-nav">' +
            '<span class="btn-menu__bars" aria-hidden="true"></span>' +
            '<span class="sr-only">메뉴 열기</span>' +
          "</button>" +
        "</div>" +
      "</div>";

    /* 모바일 메뉴는 헤더 바깥(body 바로 아래)에 둡니다.
       헤더에 backdrop-filter 가 걸려 있으면 그 안의 position:fixed 요소가
       화면이 아니라 헤더 기준으로 배치되어 보이지 않기 때문입니다. */
    var navEl = document.createElement("div");
    navEl.className = "mobile-nav";
    navEl.id = "mobile-nav";
    navEl.hidden = true;
    navEl.innerHTML =
      '<nav aria-label="모바일 메뉴"><ul class="mobile-nav__list">' + mob + "</ul></nav>" +
      '<div class="mobile-nav__cta">' +
        '<a class="btn btn--outline btn--block" href="' + BASE + 'centers.html">' + window.wfIcon("pin") + " 가까운 센터 찾기</a>" +
        window.wfDonateButton({ location: "mobile_menu", block: true }) +
        '<p class="ext-note">후원 신청과 결제는 외부 사이트인 체리 기부 플랫폼에서 진행됩니다.' +
        '<span data-donate-pending hidden><br><strong>현재 체리 기부 페이지 주소가 등록되지 않아 후원 버튼이 연결되지 않습니다.</strong></span></p>' +
      "</div>";
    document.body.appendChild(navEl);

    /* 모바일 메뉴 토글 */
    var btn = $(".btn-menu", mount);
    var nav = navEl;
    function setOpen(open) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      $(".sr-only", btn).textContent = open ? "메뉴 닫기" : "메뉴 열기";
      nav.hidden = !open;
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    }
    btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { setOpen(false); btn.focus(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && btn.getAttribute("aria-expanded") === "true") setOpen(false);
    });

    /* 스크롤 시 그림자 */
    var onScroll = function () { mount.classList.toggle("is-stuck", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ================================================================== 푸터 */
  function renderFooter() {
    var mount = $("#site-footer");
    if (!mount) return;
    var o = WF_ORG;

    var sitemap = NAV.map(function (n) {
      var subs = (n.sub.length ? n.sub : [{ label: n.label, href: n.href }]).map(function (s) {
        return '<li><a href="' + BASE + s.href + '">' + esc(s.label) + "</a></li>";
      }).join("");
      return "<div><h3>" + esc(n.label) + "</h3><ul>" + subs + "</ul></div>";
    }).join("");

    /* 기관 바로가기 — 로고 + 이름, 한 줄로 늘어섭니다. */
    var orgs = o.orgLinks || [];
    var orgItems = orgs.map(function (w) {
      var mark = has(w.logo)
        ? '<span class="footer-orgs__mark"><img src="' + BASE + esc(w.logo) + '" alt="" loading="lazy"></span>'
        : "";
      return '<a href="' + esc(w.url) + '" target="_blank" rel="noopener noreferrer">' +
             mark + "<span>" + esc(w.name) + "</span>" +
             '<span aria-hidden="true">↗</span>' +
             '<span class="sr-only">(새 창에서 열림)</span></a>';
    }).join("");

    var watchNames = orgs.filter(function (w) { return w.watchdog; })
                         .map(function (w) { return w.name; });

    var linkBand = orgs.length
      ? '<nav class="footer-orgs" aria-label="관련 기관 바로가기">' +
          '<div class="footer-orgs__links">' + orgItems + "</div>" +
          (watchNames.length
            ? '<p class="footer-orgs__note">' + esc(watchNames.join(" · ")) +
              "는 공익위반사항 관리감독기관입니다.</p>"
            : "") +
        "</nav>"
      : "";

    var sns = o.sns.length
      ? '<div class="footer-legal">' + o.sns.map(function (s) {
          return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.name) + " ↗</a>";
        }).join("") + "</div>"
      : "";

    mount.innerHTML =
      '<div class="wrap">' +
        '<div class="footer-top">' +
          '<div class="footer-brand">' +
            '<img src="' + BASE + 'assets/images/logo-withfriends.png" alt="사단법인 위드프렌즈">' +
            '<p class="footer-brand__desc">아이들의 오늘을 돌보고, 지역의 내일을 함께 만듭니다. ' +
              "위드프렌즈는 지역아동센터 3개소와 다함께돌봄센터 2개소를 운영하고 있습니다.</p>" +
          "</div>" +
          '<div class="footer-sitemap">' + sitemap + "</div>" +
        "</div>" +

        '<div class="footer-info">' +
          '<address class="footer-info__list">' +
            "<span>" + esc(o.name) + "</span>" +
            "<span>대표자: " + esc(o.representative) + "</span>" +
            "<span>사업자등록번호: " + esc(o.bizNumber) + "</span>" +
            "<span>주소: " + esc(o.address) + "</span>" +
            '<span>대표전화: <a href="tel:' + esc(o.tel.replace(/[^0-9+]/g, "")) + '">' + esc(o.tel) + "</a></span>" +
            '<span>이메일: <a href="mailto:' + esc(o.email) + '">' + esc(o.email) + "</a></span>" +
          "</address>" +

          '<div class="footer-legal">' +
            '<a href="' + BASE + 'privacy.html">개인정보처리방침</a>' +
            '<a href="' + BASE + 'terms.html">이용약관</a>' +
            '<a href="' + BASE + 'stories.html?cat=notice">공시자료</a>' +
          "</div>" + sns +

          linkBand +

          '<p class="footer-copy">© ' + new Date().getFullYear() + " " + esc(o.name) + ". All rights reserved.</p>" +
        "</div>" +
      "</div>";
  }

  /* ====================================================== 재사용 카드 컴포넌트 */

  /* 센터 카드 */
  window.wfCenterCard = function (c) {
    /* 사진 → 없으면 센터 상징 이미지 → 그것도 없으면 자리표시 그림 */
    var photo, alt, contain;
    if (has(c.photo))      { photo = c.photo; alt = esc(c.photoAlt || c.name); contain = false; }
    else if (has(c.mark))  { photo = c.mark;  alt = esc(c.name + " 상징 이미지"); contain = true; }
    else                   { photo = BASE + "assets/images/placeholder-photo.svg"; alt = ""; contain = false; }
    var decorative = !has(c.photo) && !has(c.mark);
    var detailUrl = BASE + "center-detail.html?id=" + encodeURIComponent(c.id);

    var hours = hasList(c.hours)
      ? "<ul>" + c.hours.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>"
      : '<span class="tbd"></span>';

    var routeBtn = has(c.address)
      ? '<a class="btn btn--outline btn--sm" href="https://map.naver.com/p/search/' +
        encodeURIComponent(c.address) + '" target="_blank" rel="noopener noreferrer">' +
        window.wfIcon("route") + " 길찾기<span class=\"sr-only\"> (네이버 지도, 새 창)</span></a>"
      : '<span class="btn btn--outline btn--sm btn--disabled" aria-disabled="true">' + window.wfIcon("route") + " 길찾기 준비 중</span>";

    var telBtn = has(c.tel)
      ? '<a class="btn btn--green btn--sm" href="tel:' + esc(c.tel.replace(/[^0-9+]/g, "")) + '">' +
        window.wfIcon("phone") + " 이용문의</a>"
      : '<span class="btn btn--sm btn--disabled" aria-disabled="true">' + window.wfIcon("phone") + " 이용문의 준비 중</span>";

    return '<article class="card center-card">' +
      '<div class="thumb' + (contain ? " thumb--contain" : "") + '">' +
        '<img src="' + esc(photo) + '" alt="' + alt + '"' + (decorative ? ' role="presentation"' : "") + ' loading="lazy">' +
      "</div>" +
      '<div class="card__body">' +
        '<span class="tag ' + (c.type === "dahamkke" ? "tag--green" : "tag--coral") + ' center-card__type">' + esc(c.typeLabel) + "</span>" +
        '<h3 class="card__title">' + esc(c.name) + "</h3>" +
        '<p class="card__text">' + (has(c.tagline) ? esc(c.tagline) : '<span class="tbd"></span>') + "</p>" +
        '<dl class="center-card__meta">' +
          '<div><dt class="k">이용 대상</dt><dd class="v">' + orTBD(c.target) + "</dd></div>" +
          '<div><dt class="k">운영시간</dt><dd class="v">' + hours + "</dd></div>" +
          '<div><dt class="k">이용료</dt><dd class="v">' +
            (hasList(c.fee)
              ? "<ul>" + c.fee.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>"
              : '<span class="tbd"></span>') +
          "</dd></div>" +
          '<div><dt class="k">주소</dt><dd class="v">' + orTBD(c.address) + "</dd></div>" +
          '<div><dt class="k">전화</dt><dd class="v">' +
            (has(c.tel) ? '<a href="tel:' + esc(c.tel.replace(/[^0-9+]/g, "")) + '">' + esc(c.tel) + "</a>" : '<span class="tbd"></span>') +
          "</dd></div>" +
        "</dl>" +
        '<div class="card__foot">' +
          '<a class="btn btn--primary btn--sm" href="' + detailUrl + '">상세보기<span class="sr-only"> — ' + esc(c.name) + "</span></a>" +
          routeBtn + telBtn +
        "</div>" +
      "</div>" +
    "</article>";
  };

  /* 소식 / 이야기 카드 */
  window.wfStoryCard = function (p) {
    var img = has(p.image) ? p.image : (BASE + "assets/images/placeholder-photo.svg");
    var alt = has(p.image) ? esc(p.imageAlt || p.title) : "";
    var tags = (p.tags || []).map(function (t) { return '<span class="tag tag--green">' + esc(t) + "</span>"; }).join("");
    var titleHtml = esc(p.title);
    var link = has(p.url)
      ? '<a class="btn btn--outline btn--sm" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">자세히 보기<span class="sr-only"> (새 창)</span></a>'
      : '<span class="btn btn--outline btn--sm btn--disabled" aria-disabled="true">자세히 보기 준비 중</span>';

    /* 사진이 없는 공지·자료 글은 사진 자리 없이 글만 보여 줍니다. */
    var showThumb = has(p.image) || p.category === "center" || p.category === "program";
    var thumb = showThumb
      ? '<div class="thumb"><img src="' + esc(img) + '" alt="' + alt + '"' +
        (has(p.image) ? "" : ' role="presentation"') + ' loading="lazy"></div>'
      : '<span class="story-card__bar" aria-hidden="true"></span>';

    return '<article class="card story-card' + (showThumb ? "" : " story-card--text") + '">' +
      thumb +
      '<div class="card__body">' +
        '<div class="story-card__head">' +
          (p.sample ? '<span class="sample-flag">샘플</span>' : "") +
          (has(p.center) ? '<span class="story-card__center">' + esc(p.center) + "</span>" : "") +
          '<time class="story-card__date" datetime="' + esc(p.date) + '">' + esc(p.date) + "</time>" +
        "</div>" +
        (tags ? '<div class="tag-row">' + tags + "</div>" : "") +
        '<h3 class="card__title story-card__title">' + titleHtml + "</h3>" +
        (has(p.summary) ? '<p class="card__text">' + esc(p.summary) + "</p>" : "") +
        '<div class="card__foot">' + link + "</div>" +
      "</div>" +
    "</article>";
  };

  /* 사업 카드 */
  window.wfBusinessCard = function (b, full) {
    return '<article class="card biz-card' + (full ? " biz-card--full" : "") + '" id="biz-' + esc(b.id) + '">' +
      '<div class="card__body">' +
        '<span class="biz-card__icon">' + window.wfIcon(b.icon) + "</span>" +
        '<h3 class="card__title">' + esc(b.title) + "</h3>" +
        '<p class="card__text biz-card__text">' + esc(b.body) + "</p>" +
        (full ? "" : '<div class="card__foot"><a class="btn btn--outline btn--sm" href="' + BASE +
          "business.html#biz-" + esc(b.id) + '">자세히 보기<span class="sr-only"> — ' + esc(b.title) + "</span></a></div>") +
      "</div>" +
    "</article>";
  };

  /* 공지 한 줄 항목 */
  window.wfNewsItem = function (p) {
    var inner =
      '<span class="tag tag--yellow">' + esc((p.tags && p.tags[0]) || "소식") + "</span>" +
      '<span class="news-item__title">' + esc(p.title) + "</span>" +
      '<time class="news-item__date" datetime="' + esc(p.date) + '">' + esc(p.date) + "</time>";
    return has(p.url)
      ? '<a class="news-item" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">' + inner +
        '<span class="sr-only">(새 창에서 열림)</span></a>'
      : '<div class="news-item">' + inner + "</div>";
  };

  /* 표시 대상 글 목록 (샘플 숨김 설정 반영) */
  window.wfVisiblePosts = function () {
    var showSample = (typeof WF_SHOW_SAMPLE_POSTS === "undefined") ? false : WF_SHOW_SAMPLE_POSTS;
    return (window.WF_POSTS || []).filter(function (p) { return showSample || !p.sample; })
      .slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
  };

  /* ====================================================== 스크롤 등장 효과 */
  function initReveal() {
    var els = $$(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ================================================ 페이지 내부 앵커 탭 활성화 */
  function initAnchorNav() {
    var links = $$(".anchor-nav__link");
    if (!links.length) return;
    var targets = links.map(function (l) { return document.getElementById(l.getAttribute("href").slice(1)); })
                       .filter(Boolean);
    if (!targets.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* =============================================================== 초기 구동 */
  function boot() {
    renderHeader();
    renderFooter();
    /* 페이지 전용 스크립트가 먼저 화면을 그린 뒤에 공통 처리를 합니다. */
    if (typeof window.wfPageInit === "function") { window.wfPageInit(); }
    initDonateLinks();
    initReveal();
    initAnchorNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
