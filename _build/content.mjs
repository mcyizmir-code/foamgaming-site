/* ============================================================
   FOAM GAMING — SİTE İÇERİĞİ (tek kaynak)
   Değiştir → `node _build/build.mjs` çalıştır → commit + push.

   Yeni oyun:
     1) _build/media.py içindeki GAMES'e görsel/video yollarını ekle, `python3 _build/media.py` çalıştır
     2) Aşağıdaki GAMES dizisine bir nesne ekle (id, media.py'deki ile aynı)
     3) `node _build/build.mjs`
   Mağazaya çıkınca: googlePlay / appStore linkini yaz, status: "live".
   status: "live" | "test" | "soon" | "dev"
   ============================================================ */

export const SITE = {
  url: "https://foamgaming.com",
  name: "Foam Gaming",
  email: "help@foamgaming.com",
  // Kapalı test: önce bu Google Grubu'na katılınır, sonra oyunun test linki açılır.
  testerGroup: "https://groups.google.com/g/findorfill-testers",
  // "Çıkınca haber ver" formu. Formspree'de ücretsiz form aç → https://formspree.io/f/XXXXXXX yaz.
  // Boş kalırsa form, e-posta uygulamasını açar (mailto).
  formEndpoint: "",
  // Cloudflare Web Analytics (çerezsiz). Token yazılırsa script eklenir ve gizlilik sayfasına not düşülür.
  cfAnalyticsToken: "",
};

export const GAMES = [
  {
    id: "find-or-fill",
    pkg: "com.foamgaming.findorfill",
    color: "#fbbf24",
    status: "test",
    googlePlay: "",
    appStore: "",
    tr: {
      name: "Find or Fill",
      tagline: "İki kişilik online sayı düellosu",
      description: "Rakibin hedef sayıyı ararken sen kutularını doldur. Her turda roller değişir, 100 kutuyu ilk dolduran kazanır.",
      tags: ["Online", "1'e 1", "Refleks"],
      steps: [
        ["FIND", "Rakibinin seçtiği sayıyı karışık tabloda en hızlı şekilde bul. Yanlış dokunuş seni yarım saniye kilitler."],
        ["FILL", "Rakibin ararken kendi kağıdındaki kutulara dokunarak doldur. Doldurduğun kutular kalıcıdır."],
        ["ROLLER DEĞİŞİR", "Sayı bulununca ya da 20 saniye dolunca roller yer değiştirir."],
        ["KAZAN", "100 kutunun hepsini ilk dolduran maçı kazanır. Tek dokunuşla rövanş al."],
      ],
      features: [
        "6x6, 8x8 veya 10x10 tablo seç, rastgele rakiple anında eşleş",
        "6 haneli oda koduyla arkadaşına özel düello",
        "Birkaç dakikalık kısa ve heyecanlı maçlar",
        "Google veya Apple ile giriş ya da misafir olarak oyna",
        "Bağlantı koparsa maç duraklar, döndüğünde devam eder",
        "Maç sırasında reklam yok",
      ],
    },
    en: {
      name: "Find or Fill",
      tagline: "A 1v1 online number duel",
      description: "Fill your grid while your rival hunts for the number. Roles swap every round, and the first to fill all 100 boxes wins.",
      tags: ["Online", "1v1", "Reflex"],
      steps: [
        ["FIND", "Spot the number your rival picked in the shuffled grid. A wrong tap locks you for half a second."],
        ["FILL", "While your rival searches, tap the boxes on your own sheet. Filled boxes stay filled."],
        ["SWAP", "Roles swap when the number is found or after 20 seconds."],
        ["WIN", "First to fill all 100 boxes wins the match. Rematch with one tap."],
      ],
      features: [
        "Pick a 6x6, 8x8 or 10x10 grid and get matched instantly",
        "Private duels with a 6-character room code",
        "Short, intense matches that last a few minutes",
        "Sign in with Google or Apple, or play as a guest",
        "Lost connection? The match pauses and resumes",
        "No ads during matches",
      ],
    },
  },
  {
    id: "bird-jam",
    pkg: "com.foamgaming.birdjam",
    color: "#38bdf8",
    status: "test",
    googlePlay: "",
    appStore: "",
    tr: {
      name: "Bird Jam",
      tagline: "Kuşları uçur, sürüyü tamamla!",
      description: "Kuşlara dokun, aynı renkten 3'lü sürüler kur, göç rotasında ilerle ve kartpostal koleksiyonunu tamamla.",
      tags: ["Bulmaca", "Tek Oyuncu", "Koleksiyon"],
      steps: [
        ["DOKUN", "Kuşa dokun: baktığı yön açıksa uçar. Önü kapalıysa uçamaz, bir hakkın gider."],
        ["SÜRÜ KUR", "Uçan kuş alttaki 7 yuvalı tele konar. Aynı renkten 3 kuş sürü olup ayrılır. Tel dolmasın!"],
        ["GÜÇLENDİR", "Sıkışınca İpucu, Geri Al ve Ekstra Yuva kullan. Her bölümün çözülebildiği garanti."],
        ["TOPLA", "Her sürü bir kartpostal parçası açar. Albümleri tamamla, ilerlemen hesabında saklansın."],
      ],
      features: [
        "İstanbul'dan Kuzey Işıkları'na 12 duraklı göç rotası",
        "Her turda yeni tema: gündüz, gün batımı, gece, kış",
        "Her bölge için açılan kartpostal koleksiyonu",
        "Sürünün giydiği kostümler",
        "Kademeli zorluk: tahta ve renk sayısı giderek artar",
        "İlerleme hesabında saklanır",
      ],
    },
    en: {
      name: "Bird Jam",
      tagline: "Let the birds fly, complete the flock!",
      description: "Tap birds, build flocks of 3 of the same color, follow the migration route and complete your postcard collection.",
      tags: ["Puzzle", "Single Player", "Collection"],
      steps: [
        ["TAP", "Tap a bird: if the way it faces is clear, it flies. If it's blocked, you lose a life."],
        ["FLOCK", "Flying birds land on the 7-slot wire. 3 of the same color form a flock and fly off. Don't fill the wire!"],
        ["BOOST", "Stuck? Use Hint, Undo and Extra Slot. Every level is guaranteed solvable."],
        ["COLLECT", "Every flock reveals part of a postcard. Complete the albums, your progress is saved to your account."],
      ],
      features: [
        "A 12-stop migration route from Istanbul to the Northern Lights",
        "A new theme every round: day, sunset, night, winter",
        "Postcards to unlock for every region",
        "Costumes for your whole flock",
        "Gradual difficulty: boards and colors grow over time",
        "Progress saved to your account",
      ],
    },
  },
  {
    id: "cannon-clash",
    pkg: "com.foamgaming.cannonclash",
    color: "#ffc02e",
    status: "test",
    googlePlay: "",
    appStore: "",
    tr: {
      name: "Cannon Clash",
      tagline: "Kaleyi yık, karşı ateşten sağ çık!",
      description: "Topunu nişanla, kaleleri yık. Okçular ve topçular karşılık verir. 100 kale, 5 dünya, günlük görevler ve yeni toplar.",
      tags: ["Aksiyon", "Fizik", "Tek Oyuncu"],
      steps: [
        ["NİŞAN AL", "Ekrana bas, geri çek ve bırak. Ne kadar çekersen atış o kadar güçlü olur."],
        ["YIK", "Ahşap kuleleri devir, taşları kır, fıçıları patlat. Düşen asker de oyundan çıkar."],
        ["KORUN", "Okçular ve topçular karşılık verir. Kırmızı uyarı çıkan topçuyu önce sustur."],
        ["GÜÇLEN", "Altınla topunu geliştir, yeni toplar aç, günlük görevleri tamamla."],
      ],
      features: [
        "5 dünyada 100 kale, her 10 kalede bir boss topçu",
        "Zırhlı okçu, balista, sancaktar ve usta gibi farklı düşmanlar",
        "5 top: Sahra Topu, Uzun Namlu, Çifte Namlu, Havan, Kraliyet Topu",
        "Güç, zırh, dolum, patlama ve cephane geliştirmeleri",
        "Günlük ödül, günlük görevler ve her gün yeni bir Günün Kalesi",
        "İnternet yokken de oynanır",
      ],
    },
    en: {
      name: "Cannon Clash",
      tagline: "Smash the castle, survive the return fire!",
      description: "Aim your cannon and smash castles. Archers and gunners fire back. 100 castles, 5 worlds, daily quests and new cannons.",
      tags: ["Action", "Physics", "Single Player"],
      steps: [
        ["AIM", "Press, pull back and release. The further you pull, the stronger the shot."],
        ["SMASH", "Topple wooden towers, break stone, blow up barrels. Soldiers who fall are out too."],
        ["SURVIVE", "Archers and gunners fire back. Silence the gunner with the red warning first."],
        ["UPGRADE", "Spend gold on upgrades, unlock new cannons and finish daily quests."],
      ],
      features: [
        "100 castles across 5 worlds, a boss gunner every 10 castles",
        "Armored archers, ballistas, standard-bearers and masons",
        "5 cannons: Field Cannon, Long Barrel, Twin Barrel, Mortar, Royal Cannon",
        "Upgrade power, armor, reload, blast and ammo",
        "Daily reward, daily quests and a new Castle of the Day",
        "Plays offline too",
      ],
    },
  },
  {
    id: "bogaz-vts",
    pkg: "com.foamgaming.bogazvts",
    color: "#5fd6ff",
    status: "test",
    googlePlay: "",
    appStore: "",
    tr: {
      name: "Boğaz VTS",
      tagline: "Dünyanın boğazlarında gemi trafiğini yönet",
      description: "İstanbul Boğazı'ndan Panama'ya 7 boğazda tankerleri, vapurları ve balıkçıları yönet. Kılavuz kaptan gönder, acil durumlara yetiş, rütbe atla.",
      tags: ["Simülasyon", "Strateji", "3B"],
      steps: [
        ["KOMUT VER", "Gemiye dokun, TAM YOL, YAVAŞ ya da DUR de. Tankerler ağırdır, geç durur: erken karar ver."],
        ["KURALLARA UY", "Dönemeçte iki büyük gemi karşılaşmaz, köprü altında durulmaz. Gerekirse trafiği tek yöne al."],
        ["ACİL DURUMA YETİŞ", "Arızaya römorkör, denize düşene Sahil Güvenlik, korsana devriye, tankere kılavuz kaptan gönder."],
        ["RÜTBE ATLA", "Puanın XP olur; rütbe yükseldikçe Çanakkale, Süveyş, Panama ve diğer boğazlar açılır."],
      ],
      features: [
        "7 boğaz: İstanbul, Çanakkale, Cebelitarık, Süveyş, Hürmüz, Panama, Bab-ül Mendep",
        "Gerçek kurallar: dönemeçte karşılaşma yasağı, kılavuz kaptan zorunluluğu",
        "Senaryolu görevler: Kıtalararası Yüzme Yarışı, 18 Mart töreni ve fazlası",
        "Stajyerden VTS Şefine rütbe sistemi",
        "Günlük görevler ve haftalık sıralama",
        "Gece, sis ve sağanak; internet olmadan da oynanır",
      ],
    },
    en: {
      name: "Strait Control",
      tagline: "Command ship traffic in the world's straits",
      description: "From the Bosphorus to Panama, guide tankers, ferries and fishing boats through 7 straits. Send pilots, handle emergencies and rise through the ranks.",
      tags: ["Simulation", "Strategy", "3D"],
      steps: [
        ["COMMAND", "Tap a ship and order FULL AHEAD, SLOW or STOP. Tankers are heavy and stop late: decide early."],
        ["FOLLOW THE RULES", "Two large ships never meet in a bend, nobody stops under a bridge. Switch to one-way traffic if needed."],
        ["HANDLE EMERGENCIES", "Tugs for breakdowns, the Coast Guard for man overboard, patrols for pirates, pilots for tankers."],
        ["RANK UP", "Your score becomes XP; higher ranks unlock the Dardanelles, Suez, Panama and more."],
      ],
      features: [
        "7 straits: Bosphorus, Dardanelles, Gibraltar, Suez, Hormuz, Panama, Bab-el-Mandeb",
        "Real rules: no meeting in bends, mandatory pilots",
        "Story missions: the Cross-Continental Swim, the 18 March ceremony and more",
        "Rise from Trainee to VTS Chief",
        "Daily missions and a weekly leaderboard",
        "Night, fog and storms; plays offline",
      ],
    },
  },
];

/* Haberler / devlog — en yeni en üstte. Tarih: YYYY-AA-GG */
export const NEWS = [
  {
    date: "2026-11-18", game: "bogaz-vts",
    tr: { title: "Boğaz VTS kapalı teste hazır", body: "Yedi boğazda gemi trafiğini yönettiğin 3B simülasyon oyunumuz Boğaz VTS (İngilizce adıyla Strait Control) kapalı teste giriyor." },
    en: { title: "Strait Control enters closed testing", body: "Our 3D ship-traffic simulation across seven straits, Strait Control (Boğaz VTS in Turkish), is entering closed testing." },
  },
  {
    date: "2026-11-17", game: "cannon-clash",
    tr: { title: "Cannon Clash test sürümü yayında", body: "100 kale ve 5 dünyalık fizik tabanlı aksiyon oyunumuz Cannon Clash'in ilk test sürümü kapalı testte." },
    en: { title: "Cannon Clash test build is out", body: "The first test build of Cannon Clash, our physics action game with 100 castles across 5 worlds, is now in closed testing." },
  },
  {
    date: "2026-11-11", game: "bird-jam",
    tr: { title: "Bird Jam kapalı teste başladı", body: "Kuşları uçurup sürüler kurduğun ve kartpostal topladığın bulmaca oyunumuz Bird Jam kapalı testte." },
    en: { title: "Bird Jam closed test begins", body: "Bird Jam, our puzzle game about flying birds, building flocks and collecting postcards, is now in closed testing." },
  },
  {
    date: "2026-11-05", game: "find-or-fill",
    tr: { title: "Find or Fill kapalı testte", body: "İlk oyunumuz Find or Fill, iki kişilik online sayı düellosu, Google Play kapalı testinde. Katılmak için test grubumuza katılman yeterli." },
    en: { title: "Find or Fill is in closed testing", body: "Our first game, the 1v1 online number duel Find or Fill, is in closed testing on Google Play. Join our tester group to play." },
  },
];
