/* Foam Gaming — menü, galeri, video, haber formu, gizlilik dil seçici */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Mobil menü
  const toggle = $(".nav-toggle");
  if (toggle) {
    const set = open => { document.body.classList.toggle("nav-open", open); toggle.setAttribute("aria-expanded", open); };
    toggle.addEventListener("click", () => set(!document.body.classList.contains("nav-open")));
    $$(".nav a").forEach(a => a.addEventListener("click", () => set(false)));
    addEventListener("keydown", e => e.key === "Escape" && set(false));
  }

  // Ekran görüntüsü büyütme
  const lb = $(".lightbox");
  if (lb && lb.showModal) {
    const im = $("img", lb);
    $$(".shot").forEach(b => b.addEventListener("click", () => { im.src = b.dataset.full; im.alt = $("img", b)?.alt || ""; lb.showModal(); }));
    $(".lb-close", lb).addEventListener("click", () => lb.close());
    lb.addEventListener("click", e => e.target === lb && lb.close());
  }

  // Otomatik videolar: ekranda değilken dur, ses düğmesi
  const autos = $$("video[autoplay]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()), { threshold: .25 });
    autos.forEach(v => io.observe(v));
  }
  $$(".unmute").forEach(b => b.addEventListener("click", () => {
    const v = b.parentElement.querySelector("video");
    v.muted = !v.muted; b.classList.toggle("on", !v.muted);
    if (!v.muted) { v.currentTime = 0; v.play().catch(() => {}); }
  }));

  // Haber ver formu: Formspree vb. uç nokta varsa fetch, yoksa e-posta uygulaması
  $$("form.notify").forEach(f => f.addEventListener("submit", async e => {
    e.preventDefault();
    const msg = $(".form-msg", f), btn = $("button", f), d = new FormData(f);
    if (d.get("_gotcha")) return;
    const show = (t, c) => { msg.textContent = t; msg.className = "form-msg " + c; };
    if (!f.dataset.endpoint) {
      const body = `Merhaba / Hi,\n\nOyunlar çıkınca bana haber verin / Notify me at launch.\nE-posta / Email: ${d.get("email")}\nOyun / Game: ${d.get("game")}`;
      location.href = `mailto:${f.dataset.mail}?subject=${encodeURIComponent("Haber listesi / Launch list")}&body=${encodeURIComponent(body)}`;
      return show(f.dataset.mailmsg, "ok");
    }
    btn.disabled = true;
    try {
      const r = await fetch(f.dataset.endpoint, { method: "POST", body: d, headers: { Accept: "application/json" } });
      if (!r.ok) throw 0;
      f.reset(); show(f.dataset.ok, "ok");
    } catch { show(f.dataset.err, "err"); }
    btn.disabled = false;
  }));

  // Gizlilik / veri silme: dil seçici
  const legal = $(".legal");
  if (legal) {
    const btns = $$(".lang-switch button", legal);
    const setLang = l => { legal.dataset.lang = l; btns.forEach(b => b.classList.toggle("on", b.dataset.l === l)); };
    btns.forEach(b => b.addEventListener("click", () => setLang(b.dataset.l)));
    const q = new URLSearchParams(location.search).get("lang");
    const def = legal.dataset.default === "en" ? "en" : ((navigator.language || "tr").toLowerCase().startsWith("tr") ? "tr" : "en");
    setLang(q === "tr" || q === "en" ? q : def);
  }
})();
