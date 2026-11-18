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
  ,{
    id: "cannon-clash",
    name: "Cannon Clash",
    tagline: "Kaleyi yık, karşı ateşten sağ çık!",
    description: "Topunu nişanla, kaleleri yık. Okçular ve topçular karşılık verir. 100 kale, 5 dünya, günlük görevler ve toplar.",
    icon: "cannon-clash-icon.png",
    color: "#ffc02e",
    tags: ["Aksiyon", "Fizik", "Tek Oyuncu"],
    status: "soon",
    page: "cannon-clash.html",
    googlePlay: "",   // yayınlanınca: https://play.google.com/store/apps/details?id=com.foamgaming.cannonclash
    appStore: ""
  }
  ,{
    id: "bogaz-vts",
    name: "Boğaz VTS",
    tagline: "Dünyanın boğazlarında gemi trafiğini yönet",
    description: "İstanbul Boğazı'ndan Panama'ya 7 boğazda tankerleri, vapurları ve balıkçıları yönet. Kılavuz kaptan gönder, acil durumlara yetiş, rütbe atla.",
    icon: "bogaz-vts-icon.png",
    color: "#5fd6ff",
    tags: ["Simülasyon", "Strateji", "Tek Oyuncu"],
    status: "dev",
    page: "bogaz-vts.html",
    googlePlay: "",   // yayınlanınca: https://play.google.com/store/apps/details?id=com.foamgaming.bogazvts
    appStore: ""
  }
  // Sıradaki oyun:
  // { id: "hoop-star", name: "Hoop Star", ..., status: "dev" }
];

window.FOAM_STATUS = { live: "Şimdi oyna", test: "Kapalı test", soon: "Yakında", dev: "Geliştiriliyor" };
