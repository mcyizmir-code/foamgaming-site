/* Foam Gaming — ortak header/footer, oyun kartları, oyun sayfası, dil seçici */
(function () {
  const games = window.FOAM_GAMES || [];
  const S = window.FOAM_STATUS || {};
  const page = location.pathname.split("/").pop() || "index.html";
  const MAIL = "help@foamgaming.com";

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = g => `<img src="${esc(g.icon)}" alt="${esc(g.name)}" loading="lazy">`;

  // Header
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap">
        <a class="brand" href="index.html"><img src="foam-gaming.png" alt="Foam Gaming"></a>
        <nav class="nav">
          <a href="index.html#oyunlar" class="${page === "index.html" || games.some(g => g.page === page) ? "active" : ""}">Oyunlar</a>
          <a href="privacy.html" class="${page === "privacy.html" ? "active" : ""}">Gizlilik</a>
          <a href="delete-data.html" class="hide-sm ${page === "delete-data.html" ? "active" : ""}">Veri silme</a>
          <a href="mailto:${MAIL}">İletişim</a>
        </nav>
      </div>`;
  }

  // Footer
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="wrap">
        <div>© ${new Date().getFullYear()} Foam Gaming · <a href="mailto:${MAIL}">${MAIL}</a></div>
        <div>${games.map(g => `<a href="${esc(g.page)}">${esc(g.name)}</a>`).join("")}<a href="privacy.html">Gizlilik Politikası</a><a href="delete-data.html">Veri silme</a></div>
      </div>`;
  }

  // Ana sayfa: oyun kartları
  const grid = document.getElementById("games-grid");
  if (grid) {
    grid.innerHTML = games.map(g => `
      <a class="game-card" href="${esc(g.page)}" style="--gc:${esc(g.color)}">
        <div class="game-art">${icon(g)}</div>
        <div class="game-body">
          <span class="badge ${esc(g.status)}">${esc(S[g.status] || g.status)}</span>
          <h3>${esc(g.name)}</h3>
          <p>${esc(g.description)}</p>
          <div class="tags">${(g.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </div>
      </a>`).join("") + `
      <div class="next-card"><div><div class="plus">+</div><strong>Yeni oyunlar yolda</strong>Sıradaki oyun çok yakında.</div></div>`;
  }

  // Oyun sayfası: <body data-game="...">
  const g = games.find(x => x.id === document.body.dataset.game);
  if (g) {
    document.body.style.setProperty("--gc", g.color);
    const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    set("g-logo", icon(g));
    set("g-name", esc(g.name));
    set("g-desc", esc(g.description));
    set("g-badge", `<span class="badge ${esc(g.status)}">${esc(S[g.status] || g.status)}</span>`);
    const store = (url, label) => url
      ? `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`
      : `<span class="btn ghost disabled">${label} · Yakında</span>`;
    set("g-stores", store(g.googlePlay, "Google Play") + store(g.appStore, "App Store"));
    set("g-legal", `<a href="privacy.html">Gizlilik Politikası</a><a href="delete-data.html">Hesap ve veri silme</a><a href="mailto:${MAIL}?subject=${encodeURIComponent(g.name)}">Destek</a>`);
  }

  // Gizlilik sayfalarında oyun listesi + dil seçici
  document.querySelectorAll("[data-games-list]").forEach(el => {
    el.innerHTML = games.map(x => `<li><a href="${esc(x.page)}">${esc(x.name)}</a></li>`).join("");
  });
  const legal = document.querySelector(".legal");
  if (legal) {
    const btns = legal.querySelectorAll(".lang-switch button");
    const setLang = l => { legal.dataset.lang = l; btns.forEach(b => b.classList.toggle("on", b.dataset.l === l)); };
    btns.forEach(b => b.addEventListener("click", () => setLang(b.dataset.l)));
    const q = new URLSearchParams(location.search).get("lang");
    setLang(q || ((navigator.language || "tr").startsWith("tr") ? "tr" : "en"));
  }
})();
