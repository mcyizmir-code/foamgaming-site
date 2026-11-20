#!/usr/bin/env node
/* Foam Gaming — statik site üretici.
   Kullanım:  cd foamgaming-site && node _build/build.mjs
   İçerik: _build/content.mjs · Görseller: _build/media.json (python3 _build/media.py üretir)
   Çıktı: kökteki .html dosyaları, en/ klasörü, sitemap.xml, robots.txt, 404.html, site.webmanifest */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { SITE, GAMES, NEWS } from "./content.mjs";

const B = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(B);
const MEDIA = JSON.parse(fs.readFileSync(path.join(B, "media.json"), "utf8"));
const LANGS = ["tr", "en"];
const TODAY = new Date().toISOString().slice(0, 10);
const written = [];

/* ---------- yardımcılar ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const write = (rel, content) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
  written.push(rel);
};
const hash = f => crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex").slice(0, 8);
const url = (lang, slug = "index.html") => (lang === "en" ? "/en/" : "/") + (slug === "index.html" ? "" : slug);
const abs = p => SITE.url + p;
const img = (m, alt, cls = "", lazy = true) =>
  `<img src="/${m.src}" width="${m.size[0]}" height="${m.size[1]}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ""}${lazy ? ' loading="lazy" decoding="async"' : ""}>`;
const kb = n => (n / 1048576).toFixed(1).replace(".", ",") + " MB";
const fmtDate = (d, lang) => new Date(d + "T12:00:00Z").toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" });
const testUrl = g => `https://play.google.com/apps/testing/${g.pkg}`;
const playUrl = g => g.googlePlay || `https://play.google.com/store/apps/details?id=${g.pkg}`;
const gm = id => MEDIA.games[id];

/* ---------- metinler ---------- */
const T = {
  tr: {
    locale: "tr_TR", games: "Oyunlar", news: "Haberler", press: "Basın kiti", contact: "İletişim",
    privacy: "Gizlilik", privacyLong: "Gizlilik Politikası", deletion: "Veri silme", deletionLong: "Hesap ve veri silme",
    joinTest: "Teste katıl", details: "Ayrıntılar", soon: "Yakında", menu: "Menü",
    status: { live: "Yayında", test: "Kapalı test", soon: "Yakında", dev: "Geliştiriliyor" },
    heroTitle: "Kısa molalar için<br><span>büyük eğlence</span>",
    heroText: "Foam Gaming, hızlı açılan ve bırakması zor mobil oyunlar yapan bağımsız bir stüdyo. Oyunlarımızı herkesten önce dene.",
    explore: "Oyunları keşfet",
    statGames: "oyun", statLangs: "dil: Türkçe ve İngilizce", statPlatforms: "Android ve iOS", statData: "veri satışı",
    gamesTitle: "Oyunlarımız", gamesSub: "Google Play ve App Store için geliştirdiğimiz oyunlar. Hepsi şu an kapalı testte, ücretsiz katılabilirsin.",
    nextTitle: "Yeni oyunlar yolda", nextText: "Sıradaki oyunu ilk duyanlardan olmak için haber listesine katıl.",
    testTitle: "Oyunları herkesten önce oyna", testSub: "Kapalı testlerimiz Google Play'de. Android telefonun ve Google hesabın yeterli, katılım ücretsiz.",
    testSteps: [
      ["Test grubuna katıl", "Google Grubumuza Google hesabınla katıl. Tüm oyunlarımızın testleri bu grupla açılıyor."],
      ["Test davetini kabul et", "Oyunun test sayfasını aç ve “Test kullanıcısı ol” butonuna dokun."],
      ["Play Store'dan indir", "Birkaç dakika içinde oyun Play Store'da görünür. Kur, oyna, bize yaz."],
    ],
    groupBtn: "Gruba katıl", optinBtn: "Test davetini aç", playBtn: "Play Store'da aç",
    testVideo: "Teste nasıl katılırım? (30 sn)",
    pickGame: "Hangi oyunu test etmek istersin?",
    newsTitle: "Son haberler", newsSub: "Stüdyodan güncellemeler, yeni oyunlar ve test duyuruları.", allNews: "Tüm haberler",
    aboutTitle: "Hakkımızda", aboutSub: "Küçük ekip, net hedef: oynaması kolay, ustalaşması keyifli oyunlar.",
    about: [
      ["Hızlı oyun", "Birkaç dakikalık molalara uygun, hemen başlayan oyunlar. Çoğu internetsiz de oynanır."],
      ["Gizliliğe saygı", "Sadece oyunun çalışması için gereken veriyi işliyoruz, veri satmıyoruz. Hesabını oyunun içinden silebilirsin."],
      ["Ulaşılabilir destek", "Soru, öneri ve hata bildirimlerini okuyup yanıtlıyoruz. Testçilerin geri bildirimi oyunlarımızı şekillendiriyor."],
    ],
    notifyTitle: "Oyunlar çıkınca haber verelim", notifyText: "iPhone kullanıyorsan ya da mağazaya çıktığında duymak istiyorsan e-postanı bırak. Yılda birkaç e-posta, istediğin an ayrılabilirsin.",
    email: "E-posta adresin", notifyBtn: "Haber ver", notifyOk: "Teşekkürler! Oyunlar çıkınca sana yazacağız.", notifyErr: "Gönderilemedi, birazdan tekrar dener misin?",
    notifyMail: "E-posta uygulaman açılıyor, gönder demen yeterli.",
    howTo: "Nasıl oynanır?", features: "Öne çıkanlar", shots: "Ekran görüntüleri", trailer: "Oyun videosu",
    gameTestTitle: name => `${name} testine katıl`, gameTestSub: "Oyun şu an Google Play kapalı testinde. Üç adımda katıl, ilk oynayanlardan ol.",
    other: "Diğer oyunlarımız", support: "Destek", unmute: "Sesi aç",
    newsPageTitle: "Haberler", newsPageSub: "Foam Gaming'den güncellemeler ve duyurular.",
    pressTitle: "Basın kiti", pressSub: "Haber, inceleme ve video içerikleri için logolar, ikonlar ve ekran görüntüleri. Görselleri bu amaçlarla serbestçe kullanabilirsin.",
    factsheet: "Stüdyo künyesi", fsStudio: "Stüdyo", fsWeb: "Web", fsContact: "İletişim", fsPlatforms: "Platformlar", fsGames: "Oyunlar", fsLangs: "Diller",
    logoKit: "Logo paketi", download: "İndir", pkg: "Paket adı", pressContact: "Röportaj, test kodu ya da ek görsel için bize yaz:",
    notFound: "Sayfa bulunamadı", notFoundText: "Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.", home: "Ana sayfaya dön",
    footerAbout: "Kısa molalar için mobil oyunlar yapan bağımsız stüdyo.", studio: "Stüdyo", legal: "Yasal",
    metaHome: "Foam Gaming bağımsız bir mobil oyun stüdyosu. Find or Fill, Bird Jam, Cannon Clash ve Boğaz VTS kapalı testte, ücretsiz katıl.",
    titleHome: "Foam Gaming — Kısa molalar için mobil oyunlar",
    cfNote: "Web sitesi: foamgaming.com ziyaret istatistikleri için çerez kullanmayan Cloudflare Web Analytics kullanılır; kişisel veri ya da çerez saklanmaz.",
  },
  en: {
    locale: "en_US", games: "Games", news: "News", press: "Press kit", contact: "Contact",
    privacy: "Privacy", privacyLong: "Privacy Policy", deletion: "Data deletion", deletionLong: "Account & data deletion",
    joinTest: "Join the test", details: "Details", soon: "Coming soon", menu: "Menu",
    status: { live: "Out now", test: "Closed test", soon: "Coming soon", dev: "In development" },
    heroTitle: "Big fun for<br><span>short breaks</span>",
    heroText: "Foam Gaming is an independent studio making mobile games that start fast and are hard to put down. Play them before anyone else.",
    explore: "Explore our games",
    statGames: "games", statLangs: "languages: English and Turkish", statPlatforms: "Android and iOS", statData: "data sold",
    gamesTitle: "Our games", gamesSub: "Games we make for Google Play and the App Store. All of them are in closed testing right now, and joining is free.",
    nextTitle: "More games on the way", nextText: "Join the mailing list to be among the first to hear about our next game.",
    testTitle: "Play our games before anyone else", testSub: "Our closed tests run on Google Play. All you need is an Android phone and a Google account. It's free.",
    testSteps: [
      ["Join the tester group", "Join our Google Group with your Google account. It unlocks the tests for all our games."],
      ["Accept the invite", "Open the game's testing page and tap “Become a tester”."],
      ["Install from Google Play", "Within a few minutes the game shows up on Google Play. Install, play, tell us what you think."],
    ],
    groupBtn: "Join the group", optinBtn: "Open the test invite", playBtn: "Open on Google Play",
    testVideo: "How to join (30 s)",
    pickGame: "Which game do you want to test?",
    newsTitle: "Latest news", newsSub: "Studio updates, new games and test announcements.", allNews: "All news",
    aboutTitle: "About us", aboutSub: "Small team, clear goal: games that are easy to play and fun to master.",
    about: [
      ["Quick play", "Games that start instantly and fit a few-minute break. Most of them play offline too."],
      ["Privacy first", "We only process what the game needs to work and we never sell data. Delete your account from inside the game."],
      ["Real support", "We read and answer every question, idea and bug report. Tester feedback shapes our games."],
    ],
    notifyTitle: "Get notified at launch", notifyText: "On iPhone, or just want to hear when the games hit the stores? Leave your email. A few emails a year, unsubscribe anytime.",
    email: "Your email address", notifyBtn: "Notify me", notifyOk: "Thanks! We'll email you when the games launch.", notifyErr: "Couldn't send it, please try again in a moment.",
    notifyMail: "Your email app is opening, just hit send.",
    howTo: "How to play", features: "Highlights", shots: "Screenshots", trailer: "Gameplay video",
    gameTestTitle: name => `Join the ${name} test`, gameTestSub: "The game is in closed testing on Google Play. Join in three steps and be one of the first players.",
    other: "More games", support: "Support", unmute: "Unmute",
    newsPageTitle: "News", newsPageSub: "Updates and announcements from Foam Gaming.",
    pressTitle: "Press kit", pressSub: "Logos, icons and screenshots for news, reviews and videos. Feel free to use them for these purposes.",
    factsheet: "Fact sheet", fsStudio: "Studio", fsWeb: "Website", fsContact: "Contact", fsPlatforms: "Platforms", fsGames: "Games", fsLangs: "Languages",
    logoKit: "Logo pack", download: "Download", pkg: "Package name", pressContact: "For interviews, test access or more assets, email us:",
    notFound: "Page not found", notFoundText: "The page you're looking for may have moved or never existed.", home: "Back to home",
    footerAbout: "An independent studio making mobile games for short breaks.", studio: "Studio", legal: "Legal",
    metaHome: "Foam Gaming is an independent mobile game studio. Find or Fill, Bird Jam, Cannon Clash and Strait Control are in closed testing. Join for free.",
    titleHome: "Foam Gaming — Mobile games for short breaks",
    cfNote: "Website: foamgaming.com uses cookieless Cloudflare Web Analytics for visit statistics; no personal data or cookies are stored.",
  },
};

/* ---------- ikonlar (inline SVG) ---------- */
const I = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3.5v17a1 1 0 0 0 1.5.86l14.5-8.5a1 1 0 0 0 0-1.72L5.5 2.64A1 1 0 0 0 4 3.5z" fill="currentColor"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="18" r="1.2" fill="currentColor"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m-5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  dl: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 21h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="currentColor"/></svg>',
  sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" fill="currentColor"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* ---------- css/js sürümleme ---------- */
fs.mkdirSync(path.join(ROOT, "assets/css"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "assets/js"), { recursive: true });
fs.copyFileSync(path.join(B, "style.css"), path.join(ROOT, "assets/css/style.css"));
fs.copyFileSync(path.join(B, "site.js"), path.join(ROOT, "assets/js/site.js"));
const CSS_V = hash(path.join(B, "style.css")), JS_V = hash(path.join(B, "site.js"));

/* ---------- ortak parçalar ---------- */
function head(lang, p) {
  const t = T[lang];
  const canonical = abs(p.canonical || url(lang, p.slug));
  const alts = p.bilingual === false ? "" : `
  <link rel="alternate" hreflang="tr" href="${abs(url("tr", p.slug))}">
  <link rel="alternate" hreflang="en" href="${abs(url("en", p.slug))}">
  <link rel="alternate" hreflang="x-default" href="${abs(url("tr", p.slug))}">`;
  const ogImg = p.ogImage || MEDIA.ogHome;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.description)}">
  <link rel="canonical" href="${canonical}">${alts}
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:type" content="${p.ogType || "website"}">
  <meta property="og:title" content="${esc(p.ogTitle || p.title)}">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${abs("/" + ogImg.src)}">
  <meta property="og:image:width" content="${ogImg.size[0]}">
  <meta property="og:image:height" content="${ogImg.size[1]}">
  <meta property="og:locale" content="${t.locale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0b0e2a">${p.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/nunito-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/style.css?v=${CSS_V}">${(p.jsonld || []).map(j => `
  <script type="application/ld+json">${JSON.stringify(j)}</script>`).join("")}${SITE.cfAnalyticsToken ? `
  <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(SITE.cfAnalyticsToken)}"}'></script>` : ""}
</head>`;
}

function header(lang, p) {
  const t = T[lang], other = lang === "tr" ? "en" : "tr";
  const otherHref = p.bilingual === false ? url(other) : url(other, p.slug) + (p.langQuery ? `?lang=${other}` : "");
  const nav = [
    [url(lang) + "#oyunlar", t.games, p.section === "games"],
    [url(lang, "news.html"), t.news, p.section === "news"],
    [url(lang, "press.html"), t.press, p.section === "press"],
    [`mailto:${SITE.email}`, t.contact, false],
  ];
  return `
<body${p.bodyAttr || ""}>
  <a class="skip" href="#main">${lang === "tr" ? "İçeriğe geç" : "Skip to content"}</a>
  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="${url(lang)}" aria-label="${SITE.name}">${img(MEDIA.logo, SITE.name, "", false)}</a>
      <nav class="nav" id="nav" aria-label="${t.menu}">
        ${nav.map(([h, l, a]) => `<a href="${h}"${a ? ' aria-current="page"' : ""}>${l}</a>`).join("\n        ")}
        <a class="lang" href="${otherHref}" hreflang="${other}" lang="${other}">${other.toUpperCase()}</a>
        <a class="btn btn-sm" href="${url(lang)}#test">${t.joinTest}</a>
      </nav>
      <button class="nav-toggle" aria-controls="nav" aria-expanded="false" aria-label="${t.menu}"><span></span><span></span><span></span></button>
    </div>
  </header>
  <main id="main">`;
}

function footer(lang) {
  const t = T[lang];
  return `
  </main>
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div class="footer-brand">
        ${img(MEDIA.logo, SITE.name)}
        <p>${t.footerAbout}</p>
        <a href="mailto:${SITE.email}">${SITE.email}</a>
      </div>
      <div><h4>${t.games}</h4>${GAMES.map(g => `<a href="${url(lang, g.id + ".html")}">${esc(g[lang].name)}</a>`).join("")}</div>
      <div><h4>${t.studio}</h4><a href="${url(lang, "news.html")}">${t.news}</a><a href="${url(lang, "press.html")}">${t.press}</a><a href="${url(lang)}#test">${t.joinTest}</a><a href="mailto:${SITE.email}">${t.contact}</a></div>
      <div><h4>${t.legal}</h4><a href="${url(lang, "privacy.html")}">${t.privacyLong}</a><a href="${url(lang, "delete-data.html")}">${t.deletionLong}</a></div>
    </div>
    <div class="wrap footer-bottom">© ${new Date().getFullYear()} ${SITE.name}</div>
  </footer>
  <dialog class="lightbox" aria-label="${t.shots}"><button class="lb-close" aria-label="Kapat / Close">×</button><img alt=""></dialog>
  <script src="/assets/js/site.js?v=${JS_V}" defer></script>
</body>
</html>
`;
}

const page = (lang, p, body) => head(lang, p) + header(lang, p) + body + footer(lang);
const badge = (g, lang) => `<span class="badge ${g.status}" style="--gc:${g.color}">${T[lang].status[g.status]}</span>`;

function notifyForm(lang, game = "") {
  const t = T[lang];
  return `<form class="notify" data-endpoint="${esc(SITE.formEndpoint)}" data-mail="${SITE.email}" data-ok="${esc(t.notifyOk)}" data-err="${esc(t.notifyErr)}" data-mailmsg="${esc(t.notifyMail)}">
          <label class="sr" for="email-${game || "all"}">${t.email}</label>
          <input id="email-${game || "all"}" type="email" name="email" required placeholder="${t.email}" autocomplete="email">
          <input type="hidden" name="game" value="${esc(game || "all")}"><input type="hidden" name="lang" value="${lang}">
          <input type="text" name="_gotcha" class="sr" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="btn" type="submit">${t.notifyBtn}</button>
          <p class="form-msg" role="status"></p>
        </form>`;
}

function storeButtons(g, lang) {
  const t = T[lang];
  const b = (href, icon, label) => href
    ? `<a class="btn store" href="${esc(href)}" target="_blank" rel="noopener">${icon}<span><small>${label === "Google Play" ? (lang === "tr" ? "Hemen indir" : "Get it on") : (lang === "tr" ? "İndir" : "Download on the")}</small>${label}</span></a>`
    : `<span class="btn store disabled" aria-disabled="true">${icon}<span><small>${t.soon}</small>${label}</span></span>`;
  return b(g.googlePlay, I.play, "Google Play") + b(g.appStore, I.phone, "App Store");
}

function deviceMedia(g, lang, eager = false) {
  const m = gm(g.id), t = T[lang];
  const v = m.video[lang] || m.video[lang === "tr" ? "en" : "tr"];
  if (v) return `<div class="device portrait">
          <video src="/${v.src}" poster="/${v.poster}" width="${v.w}" height="${v.h}" autoplay muted loop playsinline preload="metadata" aria-label="${esc(g[lang].name)} — ${t.trailer}"></video>
          <button class="unmute" type="button" aria-label="${t.unmute}">${I.sound}</button>
        </div>`;
  const s = (m.shots[lang] || m.shots.tr)[0];
  const orient = s.size[0] > s.size[1] ? "landscape" : "portrait";
  return `<div class="device ${orient}">${img(s, `${g[lang].name} — ${t.shots}`, "", !eager)}</div>`;
}

function testSteps(lang, g) {
  const t = T[lang];
  const links = [
    `<a class="btn btn-sm" href="${SITE.testerGroup}" target="_blank" rel="noopener">${t.groupBtn} ${I.arrow}</a>`,
    g ? `<a class="btn btn-sm" href="${testUrl(g)}" target="_blank" rel="noopener">${t.optinBtn} ${I.arrow}</a>`
      : `<div class="pick"><span>${t.pickGame}</span>${GAMES.filter(x => x.status === "test").map(x => `<a class="chip" href="${testUrl(x)}" target="_blank" rel="noopener" style="--gc:${x.color}">${img(gm(x.id).icon, "")}${esc(x[lang].name)}</a>`).join("")}</div>`,
    g ? `<a class="btn btn-sm ghost" href="${playUrl(g)}" target="_blank" rel="noopener">${I.play} ${t.playBtn}</a>` : "",
  ];
  return `<ol class="tsteps">${t.testSteps.map(([h, p], i) => `
          <li><span class="num">${i + 1}</span><div><h3>${h}</h3><p>${p}</p>${links[i]}</div></li>`).join("")}
        </ol>`;
}

/* ---------- sayfalar ---------- */
function home(lang) {
  const t = T[lang];
  const testing = GAMES.some(g => g.status === "test");
  const tv = MEDIA["test-join-tr"];
  const jsonld = [
    { "@context": "https://schema.org", "@type": "Organization", name: SITE.name, url: SITE.url, logo: abs("/apple-touch-icon.png"), email: SITE.email },
    { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url, inLanguage: lang },
  ];
  const body = `
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <h1>${t.heroTitle}</h1>
          <p>${t.heroText}</p>
          <div class="cta-row">
            <a class="btn" href="#oyunlar">${t.explore} ${I.arrow}</a>
            ${testing ? `<a class="btn ghost" href="#test">${t.joinTest}</a>` : ""}
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          ${GAMES.slice(0, 4).map((g, i) => `<a href="${url(lang, g.id + ".html")}" tabindex="-1" class="float f${i}" style="--gc:${g.color}">${img(gm(g.id).icon, "", "", false)}</a>`).join("\n          ")}
        </div>
      </div>
      <div class="wrap stats">
        <div><b>${GAMES.length}</b><span>${t.statGames}</span></div>
        <div><b>2</b><span>${t.statLangs}</span></div>
        <div><b>${I.phone}</b><span>${t.statPlatforms}</span></div>
        <div><b>0</b><span>${t.statData}</span></div>
      </div>
    </section>

    <section id="oyunlar">
      <div class="wrap">
        <h2 class="section-title">${t.gamesTitle}</h2>
        <p class="section-sub">${t.gamesSub}</p>
        <div class="games">
          ${GAMES.map(g => {
            const m = gm(g.id), x = g[lang];
            return `<a class="game-card" href="${url(lang, g.id + ".html")}" style="--gc:${g.color}">
            <div class="game-art">${img(m.feature[lang] || m.feature.tr, x.name)}</div>
            <div class="game-body">
              <div class="game-head">${img(m.icon, "", "gicon")}<div>${badge(g, lang)}<h3>${esc(x.name)}</h3></div></div>
              <p>${esc(x.tagline)}</p>
              <div class="tags">${x.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
              <span class="more">${t.details} ${I.arrow}</span>
            </div>
          </a>`;
          }).join("\n          ")}
          <div class="next-card"><div><div class="plus">+</div><strong>${t.nextTitle}</strong><p>${t.nextText}</p><a class="btn btn-sm ghost" href="#haber">${t.notifyBtn}</a></div></div>
        </div>
      </div>
    </section>
${testing ? `
    <section id="test" class="band">
      <div class="wrap test-grid${lang === "tr" && tv ? "" : " no-video"}">
        <div>
          <h2 class="section-title">${t.testTitle}</h2>
          <p class="section-sub">${t.testSub}</p>
          ${testSteps(lang)}
        </div>${lang === "tr" && tv ? `
        <figure class="test-video">
          <div class="device portrait"><video src="/${tv.src}" poster="/${tv.poster}" width="${tv.w}" height="${tv.h}" controls playsinline preload="none"></video></div>
          <figcaption>${t.testVideo}</figcaption>
        </figure>` : ""}
      </div>
    </section>` : ""}

    <section id="haberler">
      <div class="wrap">
        <div class="title-row"><div><h2 class="section-title">${t.newsTitle}</h2><p class="section-sub">${t.newsSub}</p></div><a class="link" href="${url(lang, "news.html")}">${t.allNews} ${I.arrow}</a></div>
        <div class="news-grid">${NEWS.slice(0, 3).map(n => newsItem(n, lang)).join("")}</div>
      </div>
    </section>

    <section id="hakkimizda">
      <div class="wrap">
        <h2 class="section-title">${t.aboutTitle}</h2>
        <p class="section-sub">${t.aboutSub}</p>
        <div class="about">
          ${t.about.map(([h, p], i) => `<div><span class="about-ic">${[I.bolt, I.lock, I.chat][i]}</span><h3>${h}</h3><p>${p}${i === 1 ? ` <a href="${url(lang, "privacy.html")}">${t.privacyLong}</a>` : i === 2 ? ` <a href="mailto:${SITE.email}">${SITE.email}</a>` : ""}</p></div>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section id="haber" class="notify-band">
      <div class="wrap notify-box">
        <div><h2>${t.notifyTitle}</h2><p>${t.notifyText}</p></div>
        ${notifyForm(lang)}
      </div>
    </section>`;
  return page(lang, { slug: "index.html", title: t.titleHome, description: t.metaHome, jsonld, section: "home" }, body);
}

function newsItem(n, lang) {
  const g = GAMES.find(x => x.id === n.game), x = n[lang];
  return `
          <article class="news-item"${g ? ` style="--gc:${g.color}"` : ""}>
            <div class="news-meta"><time datetime="${n.date}">${fmtDate(n.date, lang)}</time>${g ? `<a class="chip" href="${url(lang, g.id + ".html")}">${img(gm(g.id).icon, "")}${esc(g[lang].name)}</a>` : ""}</div>
            <h3>${esc(x.title)}</h3>
            <p>${esc(x.body)}</p>
          </article>`;
}

function gamePage(lang, g) {
  const t = T[lang], x = g[lang], m = gm(g.id);
  const shots = m.shots[lang] || m.shots.tr;
  const orient = shots[0].size[0] > shots[0].size[1] ? "landscape" : "portrait";
  const feat = m.feature[lang] || m.feature.tr;
  const others = GAMES.filter(o => o.id !== g.id);
  const jsonld = [{
    "@context": "https://schema.org", "@type": "MobileApplication", name: x.name, description: x.description,
    operatingSystem: "Android, iOS", applicationCategory: "GameApplication", inLanguage: ["tr", "en"],
    image: abs("/" + feat.src), screenshot: shots.map(s => abs("/" + s.src)),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    ...(g.googlePlay ? { downloadUrl: g.googlePlay } : {}),
  }];
  const body = `
    <section class="game-hero" style="--gc:${g.color}">
      <div class="game-hero-bg" style="background-image:url('/${feat.src}')"></div>
      <div class="wrap game-hero-grid">
        <div class="game-copy">
          <div class="game-title">${img(m.icon, "", "gicon-lg", false)}<div>${badge(g, lang)}<h1>${esc(x.name)}</h1></div></div>
          <p class="tagline">${esc(x.tagline)}</p>
          <p class="lead">${esc(x.description)}</p>
          <div class="tags">${x.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
          ${g.status === "test" ? `<div class="cta-row"><a class="btn" href="#test">${t.joinTest} ${I.arrow}</a></div>` : ""}
          <div class="store-row">${storeButtons(g, lang)}</div>
        </div>
        <div class="game-media">${deviceMedia(g, lang, true)}</div>
      </div>
    </section>

    <section style="--gc:${g.color}">
      <div class="wrap">
        <h2 class="section-title">${t.shots}</h2>
        <div class="shots ${orient}">
          ${shots.map((s, i) => `<button class="shot" type="button" data-full="/${s.src}" aria-label="${t.shots} ${i + 1}">${img(s, `${x.name} — ${t.shots} ${i + 1}`)}</button>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section style="--gc:${g.color}">
      <div class="wrap two-col">
        <div>
          <h2 class="section-title">${t.howTo}</h2>
          <div class="steps">
            ${x.steps.map(([h, p], i) => `<div class="step"><span class="num">${i + 1}</span><b>${esc(h)}</b><p>${esc(p)}</p></div>`).join("\n            ")}
          </div>
        </div>
        <div>
          <h2 class="section-title">${t.features}</h2>
          <ul class="features">${x.features.map(f => `<li>${I.check}<span>${esc(f)}</span></li>`).join("")}</ul>
        </div>
      </div>
    </section>
${g.status === "test" ? `
    <section id="test" class="band" style="--gc:${g.color}">
      <div class="wrap test-grid">
        <div>
          <h2 class="section-title">${esc(t.gameTestTitle(x.name))}</h2>
          <p class="section-sub">${t.gameTestSub}</p>
          ${testSteps(lang, g)}
        </div>
        <div class="notify-card">
          <h3>${t.notifyTitle}</h3>
          <p>${t.notifyText}</p>
          ${notifyForm(lang, g.id)}
        </div>
      </div>
    </section>` : ""}

    <section>
      <div class="wrap">
        <h2 class="section-title">${t.other}</h2>
        <div class="mini-games">
          ${others.map(o => `<a class="mini" href="${url(lang, o.id + ".html")}" style="--gc:${o.color}">${img(gm(o.id).icon, "")}<div><b>${esc(o[lang].name)}</b><span>${esc(o[lang].tagline)}</span></div></a>`).join("\n          ")}
        </div>
        <div class="legal-links"><a href="${url(lang, "privacy.html")}">${t.privacyLong}</a><a href="${url(lang, "delete-data.html")}">${t.deletionLong}</a><a href="mailto:${SITE.email}?subject=${encodeURIComponent(x.name)}">${t.support}</a></div>
      </div>
    </section>`;
  return page(lang, {
    slug: g.id + ".html", title: `${x.name} — ${x.tagline} | ${SITE.name}`, ogTitle: `${x.name} — ${x.tagline}`,
    description: x.description, ogImage: feat, jsonld, section: "games", bodyAttr: ` style="--gc:${g.color}"`,
  }, body);
}

function newsPage(lang) {
  const t = T[lang];
  return page(lang, { slug: "news.html", title: `${t.newsPageTitle} — ${SITE.name}`, description: t.newsPageSub, section: "news" }, `
    <section class="page-head"><div class="wrap"><h1>${t.newsPageTitle}</h1><p class="section-sub">${t.newsPageSub}</p></div></section>
    <section class="tight"><div class="wrap news-list">${NEWS.map(n => newsItem(n, lang)).join("")}</div></section>`);
}

function pressPage(lang) {
  const t = T[lang];
  const rows = [
    [t.fsStudio, SITE.name], [t.fsWeb, `<a href="${SITE.url}">foamgaming.com</a>`], [t.fsContact, `<a href="mailto:${SITE.email}">${SITE.email}</a>`],
    [t.fsPlatforms, "Android, iOS"], [t.fsGames, GAMES.map(g => esc(g[lang].name)).join(", ")], [t.fsLangs, lang === "tr" ? "Türkçe, İngilizce" : "English, Turkish"],
  ];
  return page(lang, { slug: "press.html", title: `${t.pressTitle} — ${SITE.name}`, description: t.pressSub, section: "press" }, `
    <section class="page-head"><div class="wrap"><h1>${t.pressTitle}</h1><p class="section-sub">${t.pressSub}</p></div></section>
    <section class="tight">
      <div class="wrap press-top">
        <div class="card">
          <h2>${t.factsheet}</h2>
          <dl class="facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
        </div>
        <div class="card logo-card">
          <h2>${t.logoKit}</h2>
          <div class="logo-preview">${img(MEDIA.logo, SITE.name)}</div>
          <a class="btn btn-sm" href="/${MEDIA.logoKit.src}" download>${I.dl} ${t.download} (ZIP, ${kb(MEDIA.logoKit.bytes)})</a>
          <p class="muted">${t.pressContact} <a href="mailto:${SITE.email}?subject=Press">${SITE.email}</a></p>
        </div>
      </div>
      <div class="wrap press-games">
        ${GAMES.map(g => {
          const m = gm(g.id), x = g[lang];
          return `<article class="press-game" style="--gc:${g.color}">
          ${img(m.feature[lang] || m.feature.tr, x.name, "press-feat")}
          <div class="press-body">
            <div class="game-head">${img(m.icon, "", "gicon")}<div>${badge(g, lang)}<h3><a href="${url(lang, g.id + ".html")}">${esc(x.name)}</a></h3></div></div>
            <p>${esc(x.description)}</p>
            <p class="muted">${t.pkg}: <code>${g.pkg}</code></p>
            <a class="btn btn-sm" href="/${m.pressKit.src}" download>${I.dl} ${t.download} (ZIP, ${kb(m.pressKit.bytes)})</a>
          </div>
        </article>`;
        }).join("\n        ")}
      </div>
    </section>`);
}

/* Gizlilik ve veri silme: iki dilli içerik _build/legal/*.body.html dosyalarında.
   İlk çalıştırmada eski kök sayfalardan otomatik çıkarılır. */
function legalBody(slug) {
  const f = path.join(B, "legal", slug.replace(".html", ".body.html"));
  if (!fs.existsSync(f)) {
    const src = fs.readFileSync(path.join(ROOT, slug), "utf8");
    const start = src.indexOf("</div>", src.indexOf('class="lang-switch"')) + 6;
    const end = src.lastIndexOf("</main>");
    if (start < 6 || end < 0) throw new Error(`${slug}: içerik çıkarılamadı`);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, src.slice(start, end).replace(/<ul data-games-list><\/ul>/g, "<ul>{{GAMES}}</ul>").trim() + "\n");
  }
  return fs.readFileSync(f, "utf8");
}

function legalPage(lang, slug) {
  const t = T[lang];
  const isPriv = slug === "privacy.html";
  let body = legalBody(slug).replace(/\{\{GAMES\}\}/g, GAMES.map(g => {
    const n = g.tr.name === g.en.name ? g.tr.name : `${g.tr.name} / ${g.en.name}`;
    return `<li><a href="${url(lang, g.id + ".html")}">${esc(n)}</a></li>`;
  }).join(""));
  if (isPriv && SITE.cfAnalyticsToken) body += `\n<div class="tr note">${T.tr.cfNote}</div><div class="en note">${T.en.cfNote}</div>`;
  const title = isPriv ? t.privacyLong : t.deletionLong;
  return page(lang, {
    slug, title: `${title} — ${SITE.name}`, canonical: "/" + slug, langQuery: true,
    description: isPriv ? (lang === "tr" ? "Foam Gaming oyunlarının gizlilik politikası." : "Privacy policy for Foam Gaming games.")
      : (lang === "tr" ? "Foam Gaming oyunlarında hesabını ve verilerini nasıl silersin." : "How to delete your account and data in Foam Gaming games."),
  }, `
    <div class="wrap legal" data-lang="${lang}" data-default="${lang === "en" ? "en" : "auto"}">
      <div class="lang-switch" role="group"><button type="button" data-l="tr">Türkçe</button><button type="button" data-l="en">English</button></div>
      ${body}
    </div>`);
}

function notFound() {
  const p = { slug: "404.html", title: `404 — ${SITE.name}`, description: T.tr.notFoundText, noindex: true, bilingual: false };
  return page("tr", p, `
    <section class="page-head center"><div class="wrap">
      <div class="big404">404</div>
      <h1>${T.tr.notFound}</h1><p class="section-sub">${T.tr.notFoundText}<br><span lang="en">${T.en.notFoundText}</span></p>
      <div class="cta-row center"><a class="btn" href="/">${T.tr.home}</a><a class="btn ghost" href="/en/">${T.en.home}</a></div>
    </div></section>`);
}

/* ---------- üret ---------- */
for (const lang of LANGS) {
  const pre = lang === "en" ? "en/" : "";
  write(pre + "index.html", home(lang));
  for (const g of GAMES) write(pre + g.id + ".html", gamePage(lang, g));
  write(pre + "news.html", newsPage(lang));
  write(pre + "press.html", pressPage(lang));
  write(pre + "privacy.html", legalPage(lang, "privacy.html"));
  write(pre + "delete-data.html", legalPage(lang, "delete-data.html"));
}
write("404.html", notFound());

const slugs = ["index.html", ...GAMES.map(g => g.id + ".html"), "news.html", "press.html"];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${slugs.flatMap(s => LANGS.map(l => `  <url><loc>${abs(url(l, s))}</loc><lastmod>${TODAY}</lastmod>${LANGS.map(a => `<xhtml:link rel="alternate" hreflang="${a}" href="${abs(url(a, s))}"/>`).join("")}</url>`)).join("\n")}
  <url><loc>${abs("/privacy.html")}</loc><lastmod>${TODAY}</lastmod></url>
  <url><loc>${abs("/delete-data.html")}</loc><lastmod>${TODAY}</lastmod></url>
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /_build/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
write("site.webmanifest", JSON.stringify({
  name: SITE.name, short_name: "Foam", start_url: "/", display: "browser", background_color: "#0b0e2a", theme_color: "#0b0e2a",
  icons: [{ src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }, { src: "/favicon.png", type: "image/png" }],
}, null, 2) + "\n");

console.log(`✓ ${written.length} dosya üretildi (css v${CSS_V}, js v${JS_V})`);
