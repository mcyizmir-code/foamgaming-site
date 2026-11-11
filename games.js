/* ============================================================
   FOAM GAMING — OYUN LİSTESİ
   Yeni oyun = bu diziye bir nesne + oyunun sayfası (bird-jam.html'i kopyala).
   status: "live" | "test" | "soon" | "dev"
   ============================================================ */
window.FOAM_GAMES = [
  {
    id: "find-or-fill",
    name: "Find or Fill",
    tagline: "İki kişilik online refleks düellosu",
    description: "Rakibinin seçtiği sayıyı bul, kendi 10x10 tablonu doldur. 100 kutuyu ilk dolduran kazanır.",
    icon: "find-or-fill-icon.png",
    color: "#fbbf24",
    tags: ["Online", "2 Oyuncu", "Refleks"],
    status: "test",
    page: "find-or-fill.html",
    googlePlay: "",   // yayınlanınca: https://play.google.com/store/apps/details?id=...
    appStore: ""
  },
  {
    id: "bird-jam",
    name: "Bird Jam",
    tagline: "Kuşları uçur, sürüyü tamamla!",
    description: "Kuşlara dokun, aynı renkten 3'lü sürüler kur, bölümleri geç ve kartpostal koleksiyonunu tamamla.",
    icon: "bird-jam-icon.png",
    color: "#38bdf8",
    tags: ["Bulmaca", "Tek Oyuncu", "Koleksiyon"],
    status: "test",
    page: "bird-jam.html",
    googlePlay: "",   // yayınlanınca: https://play.google.com/store/apps/details?id=com.foamgaming.birdjam
    appStore: ""
  }
  // Sıradaki oyun:
  // { id: "hoop-star", name: "Hoop Star", ..., status: "dev" }
];

window.FOAM_STATUS = { live: "Şimdi oyna", test: "Kapalı test", soon: "Yakında", dev: "Geliştiriliyor" };
