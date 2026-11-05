/* Buổi 1: IPA cơ bản · Đuôi -ED · Đuôi -S/ES · Nghe 1.14–1.15
   Mỗi buổi học là một file như thế này. Mo_trang_hoc.html tự đọc và hiển thị. */
(() => {

/* ---------- Bảng IPA: [âm, từ ví dụ, phiên âm từ, cách đọc, thêm ví dụ] ---------- */
const VOWELS = [
  ["iː", "see", "/siː/", "“i” kéo dài. Kéo hai khóe môi sang bên như đang cười, lưỡi nâng cao phía trước.", "eat, green, teacher"],
  ["ɪ", "sit", "/sɪt/", "“i” ngắn và thả lỏng, hơi ngả về “ê”. Miệng mở hơn /iː/ một chút, không kéo dài.", "big, live, women"],
  ["ʊ", "book", "/bʊk/", "“u” ngắn, môi tròn nhẹ, thả lỏng, không chu môi nhiều.", "good, look, put"],
  ["uː", "food", "/fuːd/", "“u” kéo dài, môi chu tròn ra phía trước.", "blue, school, two"],
  ["e", "bed", "/bed/", "Giữa “e” và “ê” tiếng Việt: miệng mở vừa, khóe môi hơi kéo sang bên.", "red, said, friend"],
  ["ə", "about", "/əˈbaʊt/", "Âm “ơ” rất ngắn và nhẹ, chỉ có ở âm tiết không nhấn. Lưỡi và môi thả lỏng hoàn toàn.", "banana, teacher, today"],
  ["ɜː", "bird", "/bɜːrd/", "“ơ” kéo dài. Giọng Mỹ cong đầu lưỡi lên thêm âm /r/ ở cuối.", "work, girl, learn"],
  ["ɔː", "saw", "/sɔː/", "“o” kéo dài, môi tròn, miệng mở vừa.", "talk, walk, law"],
  ["æ", "cat", "/kæt/", "Lai giữa “a” và “e”: hạ hàm, mở miệng rộng, kéo khóe môi sang bên, lưỡi thấp phía trước.", "bad, man, happy"],
  ["ʌ", "cup", "/kʌp/", "Giống “ă/â” ngắn tiếng Việt. Miệng mở vừa, thả lỏng, bật nhanh.", "love, money, but"],
  ["ɑː", "father", "/ˈfɑːðər/", "“a” kéo dài, mở miệng rộng, lưỡi thấp và lùi về sau.", "car, start, hot (giọng Mỹ)"],
  ["ɒ", "hot", "/hɒt/", "“o” ngắn, môi hơi tròn (giọng Anh). Giọng Mỹ đọc gần /ɑː/: hot /hɑːt/.", "dog, stop, not"]
];
const DIPHTHONGS = [
  ["ɪə", "here", "/hɪə/", "Trượt từ /ɪ/ sang /ə/: “i-ơ”. Giọng Mỹ đọc thành /ɪr/: here /hɪr/.", "near, beer, idea"],
  ["eə", "hair", "/heə/", "Trượt từ /e/ sang /ə/: “e-ơ”. Giọng Mỹ đọc /er/: hair /her/.", "there, care, wear"],
  ["ʊə", "tour", "/tʊə/", "Trượt từ /ʊ/ sang /ə/: “u-ơ”. Giọng Mỹ thường đọc /ʊr/.", "pure, cure, sure"],
  ["eɪ", "day", "/deɪ/", "Trượt từ /e/ sang /ɪ/, gần như “ây” tiếng Việt.", "say, late, rain"],
  ["aɪ", "my", "/maɪ/", "Trượt từ /a/ sang /ɪ/, gần như “ai”.", "time, buy, night"],
  ["ɔɪ", "boy", "/bɔɪ/", "Trượt từ /ɔ/ sang /ɪ/, gần như “oi”.", "toy, enjoy, voice"],
  ["əʊ", "go", "/ɡəʊ/", "Giọng Anh: “ơ-u”. Giọng Mỹ (/oʊ/): “ô-u”, môi tròn dần.", "no, home, phone"],
  ["aʊ", "now", "/naʊ/", "Trượt từ /a/ sang /ʊ/, gần như “ao”.", "house, out, about"]
];
const PAIRS = [
  ["p", "pen", "/pen/", "Mím hai môi rồi bật mạnh, có luồng hơi phụt ra (đặt tờ giấy trước miệng sẽ thấy giấy rung). Vô thanh.", "stop, happy, top"],
  ["b", "bad", "/bæd/", "Mím hai môi rồi bật ra như /p/ nhưng rung cổ họng. Hữu thanh.", "job, baby, rub"],
  ["t", "tea", "/tiː/", "Đầu lưỡi chạm lợi trên (phần gồ sau răng cửa trên, không chạm răng), bật hơi mạnh. Nghe gần “th” tiếng Việt. Ở cuối từ vẫn phải bật nhẹ. Vô thanh.", "cat, stop, liked /laɪkt/"],
  ["d", "day", "/deɪ/", "Đầu lưỡi chạm lợi trên như /t/ nhưng rung cổ họng. Không đọc thành “đ” (lưỡi chạm răng). Ở cuối từ không được nuốt mất. Hữu thanh.", "good, bed, played /pleɪd/"],
  ["k", "key", "/kiː/", "Cuống lưỡi nâng chạm ngạc mềm, bật hơi mạnh, nghe gần “kh” nhẹ. Vô thanh.", "book, cake, school"],
  ["ɡ", "go", "/ɡoʊ/", "Giống /k/ nhưng rung cổ họng. Hữu thanh.", "big, bag, again"],
  ["f", "fish", "/fɪʃ/", "Răng trên chạm nhẹ môi dưới, thổi hơi qua khe. Vô thanh.", "life, laugh /læf/, phone"],
  ["v", "very", "/ˈveri/", "Răng trên chạm môi dưới như /f/ nhưng rung cổ họng. Hữu thanh.", "live, love, have"],
  ["θ", "think", "/θɪŋk/", "Đặt đầu lưỡi giữa hai hàm răng (thè ra một chút), thổi hơi qua lưỡi. Không đọc thành “th” hay “s” tiếng Việt. Vô thanh.", "three, month, both"],
  ["ð", "this", "/ðɪs/", "Lưỡi giữa hai hàm răng như /θ/ nhưng rung cổ họng. Không đọc thành “d” hay “đ”. Hữu thanh.", "that, mother, the"],
  ["s", "sun", "/sʌn/", "Đầu lưỡi gần lợi trên, hơi xì qua khe hẹp như tiếng “xì”. Ở cuối từ phải nghe rõ. Vô thanh.", "bus, cats, nice"],
  ["z", "zoo", "/zuː/", "Giống /s/ nhưng rung cổ họng, như tiếng ong “zzz”. Hữu thanh.", "is, dogs, music"],
  ["ʃ", "she", "/ʃiː/", "Chu môi tròn ra trước, lưỡi lùi hơn /s/, thổi hơi như khi nói “suỵt”. Vô thanh.", "shop, wash, nation"],
  ["ʒ", "vision", "/ˈvɪʒn/", "Giống /ʃ/ nhưng rung cổ họng. Hữu thanh.", "usual, measure, television"],
  ["tʃ", "chair", "/tʃer/", "Bắt đầu như /t/ rồi bật sang /ʃ/, môi chu ra. Mạnh và bật hơi hơn “ch” tiếng Việt. Vô thanh.", "watch, teacher, much"],
  ["dʒ", "job", "/dʒɑːb/", "Giống /tʃ/ nhưng rung cổ họng. Hữu thanh.", "change, age, judge"]
];
const OTHERS = [
  ["m", "man", "/mæn/", "Mím môi, cho hơi đi qua mũi. Ở cuối từ phải mím môi lại.", "come, time, summer"],
  ["n", "no", "/noʊ/", "Đầu lưỡi chạm lợi trên, hơi đi qua mũi. Ở cuối từ giữ lưỡi ở lợi trên.", "sun, open, ten"],
  ["ŋ", "sing", "/sɪŋ/", "Cuống lưỡi chạm ngạc mềm, hơi qua mũi, giống “ng” tiếng Việt. Không thêm /ɡ/ phía sau.", "thing, long, think /θɪŋk/"],
  ["h", "hat", "/hæt/", "Thở hơi nhẹ từ cổ họng, giống “h” tiếng Việt.", "home, happy, who"],
  ["l", "leg", "/leɡ/", "Đầu lưỡi chạm lợi trên. Ở cuối từ (feel, call) lưỡi vẫn chạm lợi, không đọc thành “u”.", "love, call, people"],
  ["r", "red", "/red/", "Cong đầu lưỡi lên và lùi ra sau, không chạm vòm miệng, môi hơi tròn. Không rung lưỡi như “r” tiếng Việt.", "right, very, car (giọng Mỹ)"],
  ["w", "we", "/wiː/", "Chu tròn môi như “u” rồi mở nhanh sang nguyên âm sau.", "water, one, why"],
  ["j", "yes", "/jes/", "Lưỡi nâng gần vòm như /iː/ rồi lướt nhanh sang nguyên âm, giống “d” giọng miền Nam.", "you, year, use"]
];

/* ---------- Từ vựng bài nghe 1.14–1.15 ---------- */
const VOCAB = [
  ["first impression", "/fɜːrst ɪmˈpreʃn/", "noun phrase", "ấn tượng ban đầu", "My <mark>first impression</mark> of Alexander was that he was much older than me."],
  ["extroverted", "/ˈekstrəvɜːrtɪd/", "adj", "hướng ngoại, cởi mở", "He was <mark>extroverted</mark> and funny."],
  ["sense of humor", "/sens əv ˈhjuːmər/", "noun phrase", "khiếu hài hước", "He had a very good <mark>sense of humor</mark>."],
  ["TV station", "/ˌtiː ˈviː ˈsteɪʃn/", "noun", "đài truyền hình", "He works for a <mark>TV station</mark>."],
  ["be interested in", "/ˈɪntrəstɪd ɪn/", "phrase", "quan tâm đến, thích", "He was also <mark>interested in</mark> the same things as me."],
  ["physically", "/ˈfɪzɪkli/", "adv", "về ngoại hình, về thể chất", "<mark>Physically</mark>, he wasn't really my type."],
  ["(not) my type", "/maɪ taɪp/", "phrase", "(không) phải gu của tôi", "He wasn't really <mark>my type</mark>."],
  ["good-looking", "/ˌɡʊd ˈlʊkɪŋ/", "adj", "ưa nhìn, đẹp trai / xinh", "He was tall and dark and very <mark>good-looking</mark>."],
  ["chemistry", "/ˈkemɪstri/", "noun", "sự “hợp nhau”, cảm giác rung động giữa hai người", "There just wasn't any <mark>chemistry</mark> between us."],
  ["imagine + V-ing", "/ɪˈmædʒɪn/", "verb", "tưởng tượng (làm gì)", "I could <mark>imagine going</mark> to a concert with him."],
  ["warm", "/wɔːrm/", "adj", "(người) ấm áp, thân thiện", "I thought he looked <mark>warm</mark> and friendly."],
  ["attractive", "/əˈtræktɪv/", "adj", "hấp dẫn, thu hút", "He looked more <mark>attractive</mark> than Alexander."],
  ["blond", "/blɑːnd/", "adj", "(tóc) vàng hoe", "He was tall with short <mark>blond</mark> hair."],
  ["amazing", "/əˈmeɪzɪŋ/", "adj", "tuyệt vời, đáng kinh ngạc", "He had <mark>amazing</mark> blue eyes."],
  ["kind of", "/ˈkaɪnd əv/", "phrase (informal)", "hơi hơi, kiểu như", "He was <mark>kind of</mark> shy and quiet at first."],
  ["shy", "/ʃaɪ/", "adj", "nhút nhát, ngại ngùng", "He was kind of <mark>shy</mark> and quiet at first."],
  ["relax", "/rɪˈlæks/", "verb", "thư giãn, bớt căng thẳng", "When we started talking, he <mark>relaxed</mark>."],
  ["have a lot in common", "/ˈkɑːmən/", "phrase", "có nhiều điểm chung", "We found we <mark>had a lot of things in common</mark>."],
  ["generous", "/ˈdʒenərəs/", "adj", "hào phóng, rộng rãi", "He was <mark>generous</mark>, too."],
  ["pay for", "/peɪ fɔːr/", "phrasal verb", "trả tiền cho", "He wanted to <mark>pay for</mark> everything."],
  ["ask for", "/æsk fɔːr/", "phrasal verb", "xin, hỏi xin", "He <mark>asked for</mark> my phone number."],
  ["go out with (sb)", "/ɡoʊ ˈaʊt wɪð/", "phrasal verb", "hẹn hò với ai", "It was impossible for me to <mark>go out with</mark> him."],
  ["a pack of cigarettes", "/pæk əv ˌsɪɡəˈrets/", "noun phrase", "một bao thuốc lá", "He took out <mark>a pack of cigarettes</mark>."],
  ["That was it.", "/ðæt wəz ɪt/", "expression", "Thế là hết / Vậy là xong (không còn cơ hội nữa)", "<mark>That was it.</mark> I could never have a boyfriend who was a smoker."],
  ["smoker", "/ˈsmoʊkər/", "noun", "người hút thuốc", "I could never have a boyfriend who was a <mark>smoker</mark>."],
  ["date", "/deɪt/", "noun", "buổi hẹn hò; người hẹn hò", "For my next <mark>date</mark> I'm going to choose the man myself."],
  ["partner", "/ˈpɑːrtnər/", "noun", "bạn đời, người yêu", "Another person can't really choose a <mark>partner</mark> for you."]
];

/* ---------- Đuôi -ED: [từ, phiên âm, đáp án (0=/ɪd/ 1=/t/ 2=/d/), giải thích, câu ví dụ] ---------- */
const ED = [
  ["liked", "/laɪkt/", 1, "like kết thúc bằng âm /k/ (vô thanh) → /t/", "I really liked him."],
  ["started", "/ˈstɑːrtɪd/", 0, "start kết thúc bằng /t/ → /ɪd/", "When we started talking, I really liked him."],
  ["extroverted", "/ˈekstrəvɜːrtɪd/", 0, "gốc kết thúc bằng /t/ → /ɪd/", "He was extroverted and funny."],
  ["interested", "/ˈɪntrəstɪd/", 0, "kết thúc bằng /t/ → /ɪd/", "He was also interested in the same things as me."],
  ["talked", "/tɔːkt/", 1, "talk kết thúc bằng /k/ → /t/", "We talked a lot about that."],
  ["looked", "/lʊkt/", 1, "look kết thúc bằng /k/ → /t/", "I thought he looked warm and friendly."],
  ["relaxed", "/rɪˈlækst/", 1, "relax kết thúc bằng /ks/ (chữ x) → /t/", "When we started talking, he relaxed."],
  ["wanted", "/ˈwɑːntɪd/", 0, "want kết thúc bằng /t/ → /ɪd/", "He wanted to pay for everything."],
  ["enjoyed", "/ɪnˈdʒɔɪd/", 2, "enjoy kết thúc bằng nguyên âm /ɔɪ/ → /d/", "I really enjoyed the evening."],
  ["asked", "/æskt/", 1, "ask kết thúc bằng /k/ → /t/", "He asked for my phone number."],
  ["walked", "/wɔːkt/", 1, "walk kết thúc bằng /k/ (chữ l câm) → /t/", "We walked out of the restaurant."],
  ["happened", "/ˈhæpənd/", 2, "happen kết thúc bằng /n/ (hữu thanh) → /d/", "And then something happened."],
  ["needed", "/ˈniːdɪd/", 0, "need kết thúc bằng /d/ → /ɪd/", "I needed some help."],
  ["visited", "/ˈvɪzɪtɪd/", 0, "visit kết thúc bằng /t/ → /ɪd/", "We visited our grandparents."],
  ["decided", "/dɪˈsaɪdɪd/", 0, "decide kết thúc bằng /d/ → /ɪd/", "She decided to stay home."],
  ["stopped", "/stɑːpt/", 1, "stop kết thúc bằng /p/ → /t/", "The bus stopped here."],
  ["laughed", "/læft/", 1, "laugh kết thúc bằng âm /f/ (viết là gh) → /t/", "Everyone laughed at the joke."],
  ["fixed", "/fɪkst/", 1, "fix kết thúc bằng /ks/ → /t/", "He fixed my bike."],
  ["washed", "/wɑːʃt/", 1, "wash kết thúc bằng /ʃ/ → /t/", "I washed the dishes."],
  ["watched", "/wɑːtʃt/", 1, "watch kết thúc bằng /tʃ/ → /t/", "We watched a movie last night."],
  ["hoped", "/hoʊpt/", 1, "hope kết thúc bằng âm /p/ (chữ e câm) → /t/", "I hoped it would be sunny."],
  ["played", "/pleɪd/", 2, "play kết thúc bằng nguyên âm → /d/", "The kids played in the park."],
  ["called", "/kɔːld/", 2, "call kết thúc bằng /l/ (hữu thanh) → /d/", "She called me yesterday."],
  ["lived", "/lɪvd/", 2, "live kết thúc bằng /v/ (hữu thanh) → /d/", "They lived in Hanoi."],
  ["opened", "/ˈoʊpənd/", 2, "open kết thúc bằng /n/ → /d/", "He opened the door."],
  ["changed", "/tʃeɪndʒd/", 2, "change kết thúc bằng /dʒ/ (hữu thanh) → /d/", "The weather changed quickly."],
  ["naked", "/ˈneɪkɪd/", 0, "tính từ đặc biệt: luôn đọc /ɪd/", "Trees look naked in winter."]
];
const ED_NOTES = [
  ["Khi nào đuôi -ed đọc là /ɪd/?", "Khi động từ kết thúc bằng âm /t/ hoặc /d/. Mẹo: “Tiền Đô”. Đuôi -ed thêm một âm tiết.", "wanted /ˈwɑːntɪd/ · needed /ˈniːdɪd/"],
  ["Khi nào đuôi -ed đọc là /t/?", "Sau âm vô thanh /p, k, f, s, ʃ, tʃ, θ/. Mẹo: “Khi Sang Sông Phải Chờ Thu Phí”.", "stopped /stɑːpt/ · laughed /læft/"],
  ["Khi nào đuôi -ed đọc là /d/?", "Sau nguyên âm và các âm hữu thanh còn lại.", "played /pleɪd/ · called /kɔːld/"],
  ["Những tính từ -ed nào luôn đọc /ɪd/?", "naked, wicked, crooked, ragged, rugged, sacred, wretched, beloved, learned (uyên bác), aged (già), blessed (thiêng liêng)", "a learned /ˈlɜːrnɪd/ man ≠ He learned /lɜːrnd/ fast."]
];

/* ---------- Đuôi -S/ES: [từ, phiên âm, đáp án (0=/s/ 1=/z/ 2=/ɪz/), giải thích, câu ví dụ] ---------- */
const ES = [
  ["works", "/wɜːrks/", 0, "work kết thúc bằng /k/ (vô thanh) → /s/", "He works for a TV station."],
  ["books", "/bʊks/", 0, "book kết thúc bằng /k/ → /s/", "We both liked books and movies."],
  ["cigarettes", "/ˌsɪɡəˈrets/", 0, "cigarette kết thúc bằng /t/ → /s/ (nghe thành /ts/)", "He took out a pack of cigarettes."],
  ["stories", "/ˈstɔːriz/", 1, "story kết thúc bằng nguyên âm → /z/", "He told me a lot of good stories."],
  ["things", "/θɪŋz/", 1, "thing kết thúc bằng /ŋ/ (hữu thanh) → /z/", "We had a lot of things in common."],
  ["movies", "/ˈmuːviz/", 1, "movie kết thúc bằng nguyên âm → /z/", "We both liked books and movies."],
  ["eyes", "/aɪz/", 1, "eye kết thúc bằng nguyên âm /aɪ/ → /z/", "He had amazing blue eyes."],
  ["cats", "/kæts/", 0, "cat kết thúc bằng /t/ → /s/", "The cats are sleeping."],
  ["laughs", "/læfs/", 0, "laugh kết thúc bằng âm /f/ (viết là gh) → /s/", "She always laughs at my jokes."],
  ["months", "/mʌnθs/", 0, "month kết thúc bằng /θ/ → /s/", "I have studied English for six months."],
  ["stops", "/stɑːps/", 0, "stop kết thúc bằng /p/ → /s/", "The bus stops here."],
  ["dogs", "/dɔːɡz/", 1, "dog kết thúc bằng /ɡ/ (hữu thanh) → /z/", "Her dogs are very friendly."],
  ["plays", "/pleɪz/", 1, "play kết thúc bằng nguyên âm → /z/", "She plays the piano."],
  ["friends", "/frendz/", 1, "friend kết thúc bằng /d/ (hữu thanh) → /z/", "My friends live nearby."],
  ["buses", "/ˈbʌsɪz/", 2, "bus kết thúc bằng /s/ → /ɪz/", "Two buses came at once."],
  ["watches", "/ˈwɑːtʃɪz/", 2, "watch kết thúc bằng /tʃ/ → /ɪz/", "He watches TV every night."],
  ["boxes", "/ˈbɑːksɪz/", 2, "box kết thúc bằng /ks/ (chữ x) → /ɪz/", "Put the boxes over there."],
  ["washes", "/ˈwɑːʃɪz/", 2, "wash kết thúc bằng /ʃ/ → /ɪz/", "She washes her hair every day."],
  ["changes", "/ˈtʃeɪndʒɪz/", 2, "change kết thúc bằng /dʒ/ → /ɪz/", "The weather changes quickly."],
  ["houses", "/ˈhaʊzɪz/", 2, "house kết thúc bằng /s/ → /ɪz/ (và /s/ của house đổi thành /z/)", "There are many old houses here."]
];
const ES_NOTES = [
  ["Khi nào đuôi -s/-es đọc là /ɪz/?", "Sau các âm xuýt /s, z, ʃ, ʒ, tʃ, dʒ/ (thường viết là s, ss, x, z, sh, ch, ce, ge). Đuôi thêm một âm tiết.", "buses /ˈbʌsɪz/ · watches /ˈwɑːtʃɪz/ · changes /ˈtʃeɪndʒɪz/"],
  ["Khi nào đuôi -s/-es đọc là /s/?", "Sau âm vô thanh /p, t, k, f, θ/. Mẹo: “Thời Phong Kiến Phương Tây”.", "stops /stɑːps/ · cats /kæts/ · books /bʊks/ · laughs /læfs/ · months /mʌnθs/"],
  ["Khi nào đuôi -s/-es đọc là /z/?", "Sau nguyên âm và các âm hữu thanh còn lại.", "plays /pleɪz/ · dogs /dɔːɡz/ · friends /frendz/ · things /θɪŋz/"]
];

const ED_OPTS = ["/ɪd/", "/t/", "/d/"], ES_OPTS = ["/s/", "/z/", "/ɪz/"];
const cards = [
  ...[...VOWELS, ...DIPHTHONGS, ...PAIRS, ...OTHERS].map(([s, w, wi, tip], i) => ({id:"ipa-" + i, deck:"ipa", type:"ipa", front:s, w, wi, back:tip})),
  ...ED_NOTES.map(([f, b, ex], i) => ({id:"ed-r" + (i + 1), deck:"ed", type:"note", front:f, back:b, example:ex})),
  ...ED.map(([w, ipa, a, why, ex]) => ({id:"ed-" + w, deck:"ed", type:"pick", prompt:"Đuôi -ed đọc là?", front:w, opts:ED_OPTS, a, ipa, back:why, example:ex})),
  ...ES_NOTES.map(([f, b, ex], i) => ({id:"es-r" + (i + 1), deck:"es", type:"note", front:f, back:b, example:ex})),
  ...ES.map(([w, ipa, a, why, ex]) => ({id:"es-" + w, deck:"es", type:"pick", prompt:"Đuôi -s/-es đọc là?", front:w, opts:ES_OPTS, a, ipa, back:why, example:ex})),
  ...VOCAB.map(([w, ipa, pos, vi, ex], i) => ({id:"v-" + String(i + 1).padStart(2, "0"), deck:"vocab", type:"vocab", front:w, ipa, pos, back:vi, example:ex,
    say:w.replace(/\(.*?\)/g, "").replace("+ V-ing", "").trim()}))
];

/* ---------- Bài tập luyện đuôi ---------- */
const drill = (id, word, kind, a, ex) => ({id, kind:"mc", ipa:true, q:`Đuôi ${kind} trong <b>${word}</b> đọc là?`, opts:kind === "-ed" ? ED_OPTS : ES_OPTS, a, ex, say:word});

(window.COURSE = window.COURSE || []).push({
  id:"b01", no:1, date:"2026-11-04",
  title:"IPA cơ bản · Đuôi -ED · Đuôi -S/ES",
  summary:"Nguyên âm, phụ âm và cách đặt lưỡi; cách đọc đuôi -ED và -S/ES; nghe hiểu 1.14–1.15 (hai buổi hẹn).",
  homeworkNote:"Bài tập về nhà buổi 1: shadowing các video cô gửi (chú ý âm đuôi), nghe 1.14 và 1.15 rồi trả lời câu hỏi, sau đó nói một bài mới về chủ đề này.",
  decks:[{id:"ipa", name:"Bảng IPA"}, {id:"ed", name:"Đuôi -ED"}, {id:"es", name:"Đuôi -S/ES"}, {id:"vocab", name:"Từ vựng 1.14–1.15"}],
  cards,

  learn:[
    {type:"html", title:"📌 Ưu tiên trước tiên", html:`<p>Học kỹ cách phát âm <b>/t/</b> và <b>/d/</b> trước, vì đây là nền tảng của đuôi -ED.</p>
      <p><a href="https://www.youtube.com/watch?v=QpYxHp6YM2I" target="_blank" rel="noopener">▶ Xem video phát âm /t/ và /d/ trên YouTube</a></p>`},

    {type:"ipa", title:"Bảng IPA: 44 âm cơ bản",
      intro:"Bấm vào từng âm để xem cách đặt lưỡi, khẩu hình và nghe từ ví dụ. Máy đọc cả từ, không đọc riêng âm; hãy chú ý nghe âm đó nằm trong từ. Dấu ː nghĩa là âm dài.",
      groups:[
        {title:"Nguyên âm đơn (12)", sounds:VOWELS},
        {title:"Nguyên âm đôi (8)", note:"Nguyên âm đôi = trượt nhanh từ âm đầu sang âm sau trong một hơi.", sounds:DIPHTHONGS},
        {title:"Phụ âm theo cặp: vô thanh / hữu thanh (16)", note:"Mỗi cặp đặt lưỡi và miệng giống nhau; âm thứ hai rung cổ họng.", sounds:PAIRS},
        {title:"Các phụ âm còn lại (8)", sounds:OTHERS}
      ].map(g => Object.assign(g, {sounds:g.sounds.map(([s, w, wi, tip, more]) => ({s, w, wi, tip, more}))}))},

    {type:"html", title:"Âm vô thanh và âm hữu thanh", html:`
      <p>Đặt tay lên cổ họng rồi đọc kéo dài <b>“sss”</b> và <b>“zzz”</b>: âm /z/ làm cổ họng rung, âm /s/ thì không. Đây là chìa khóa để đọc đúng đuôi -ED và -S/ES.</p>
      <div class="tbl"><table>
        <tr><th>Vô thanh (không rung)</th><td class="ipa">/p/ /t/ /k/ /f/ /θ/ /s/ /ʃ/ /tʃ/ /h/</td></tr>
        <tr><th>Hữu thanh (rung)</th><td class="ipa">/b/ /d/ /ɡ/ /v/ /ð/ /z/ /ʒ/ /dʒ/ /m/ /n/ /ŋ/ /l/ /r/ /w/ /j/ và <b>tất cả nguyên âm</b></td></tr>
      </table></div>`},

    {type:"html", title:"Đuôi -ED: 3 cách đọc", html:`
      <div class="tbl"><table>
        <tr><th>Cách đọc</th><th>Khi nào</th><th>Mẹo nhớ</th><th>Ví dụ</th></tr>
        <tr><td class="ipa"><b>/ɪd/</b></td><td>Âm cuối là /t/ hoặc /d/ (thêm 1 âm tiết)</td><td>“Tiền Đô”</td><td class="ipa">wanted /ˈwɑːntɪd/, needed /ˈniːdɪd/, decided</td></tr>
        <tr><td class="ipa"><b>/t/</b></td><td>Âm cuối vô thanh /p, k, f, s, ʃ, tʃ, θ/</td><td>“Khi Sang Sông Phải Chờ Thu Phí”</td><td class="ipa">stopped /stɑːpt/, looked, laughed /læft/, fixed /fɪkst/, washed, watched</td></tr>
        <tr><td class="ipa"><b>/d/</b></td><td>Các trường hợp còn lại (hữu thanh, nguyên âm)</td><td></td><td class="ipa">played /pleɪd/, called, lived, opened, changed</td></tr>
      </table></div>
      <ul>
        <li><b>Xét theo âm, không theo chữ:</b> laugh viết “gh” nhưng âm cuối là /f/ → /t/; fix viết “x” nhưng âm cuối là /ks/ → /t/.</li>
        <li><b>Chữ “e” câm không tính:</b> hope → âm cuối /p/ → hoped /hoʊpt/.</li>
        <li><b>Tính từ đặc biệt luôn đọc /ɪd/:</b> naked, wicked, crooked, ragged, rugged, sacred, wretched, beloved, learned (uyên bác), aged (già), blessed (thiêng liêng). So sánh: <i>a learned /ˈlɜːrnɪd/ man</i> ≠ <i>He learned /lɜːrnd/ fast</i>.</li>
      </ul>`},

    {type:"html", title:"Đuôi -S/-ES: 3 cách đọc", html:`
      <p>Áp dụng cho danh từ số nhiều (books), động từ ngôi thứ ba (he works), sở hữu cách (Tom's) và dạng rút gọn (it's).</p>
      <div class="tbl"><table>
        <tr><th>Cách đọc</th><th>Khi nào</th><th>Mẹo nhớ</th><th>Ví dụ</th></tr>
        <tr><td class="ipa"><b>/ɪz/</b></td><td>Âm cuối là âm xuýt /s, z, ʃ, ʒ, tʃ, dʒ/ (thêm 1 âm tiết)</td><td>Chữ cuối thường là s, ss, x, z, sh, ch, ce, ge</td><td class="ipa">buses, boxes /ˈbɑːksɪz/, washes, watches /ˈwɑːtʃɪz/, changes</td></tr>
        <tr><td class="ipa"><b>/s/</b></td><td>Âm cuối vô thanh /p, t, k, f, θ/</td><td>“Thời Phong Kiến Phương Tây”</td><td class="ipa">stops, cats /kæts/, books /bʊks/, laughs /læfs/, months /mʌnθs/</td></tr>
        <tr><td class="ipa"><b>/z/</b></td><td>Các trường hợp còn lại (hữu thanh, nguyên âm)</td><td></td><td class="ipa">plays /pleɪz/, dogs, friends /frendz/, things /θɪŋz/, eyes</td></tr>
      </table></div>
      <ul>
        <li><b>Xét theo âm:</b> laughs (gh = /f/) → /s/; boxes (x = /ks/) → /ɪz/.</li>
        <li><b>Trường hợp đặc biệt:</b> houses /ˈhaʊzɪz/ (âm /s/ của house đổi thành /z/), says /sez/, does /dʌz/.</li>
      </ul>`},

    {type:"html", title:"Cụm phụ âm cuối khó: /ks/, /ts/, /tʃɪz/…", html:`
      <div class="tbl"><table>
        <tr><th>Cụm</th><th>Ví dụ</th></tr>
        <tr><td class="ipa">/ks/</td><td class="ipa">books /bʊks/, six /sɪks/, works, fix</td></tr>
        <tr><td class="ipa">/ts/</td><td class="ipa">cats /kæts/, it's, what's, gets</td></tr>
        <tr><td class="ipa">/tʃɪz/</td><td class="ipa">watches /ˈwɑːtʃɪz/, matches, teaches</td></tr>
        <tr><td class="ipa">/kst/</td><td class="ipa">fixed /fɪkst/, relaxed /rɪˈlækst/, next /nekst/</td></tr>
        <tr><td class="ipa">/sts/ · /ksts/</td><td class="ipa">tests /tests/, lists · texts /teksts/</td></tr>
        <tr><td class="ipa">/nθs/ · /ndz/</td><td class="ipa">months /mʌnθs/ · friends /frendz/</td></tr>
      </table></div>
      <ul>
        <li><b>Không bỏ âm cuối:</b> books phải nghe rõ /ks/, không đọc thành “búc”.</li>
        <li><b>Không thêm “ơ” sau phụ âm:</b> books /bʊks/ chứ không phải “búc-xơ”; fixed /fɪkst/ chứ không phải “phích-xơ-tơ”.</li>
        <li><b>Nối âm cuối với nguyên âm của từ sau:</b> looked at → “lúc-tát”; books and → “búk-sần”.</li>
        <li><b>Tập chậm rồi nhanh dần:</b> tách từng âm (/t/ – /e/ – /k/ – /s/ – /t/ – /s/) rồi ghép lại thành texts.</li>
      </ul>`},

    {type:"cards", title:"Thẻ ôn tập của buổi này"}
  ],

  exercises:[
    {id:"shadow", type:"shadowing", title:"Shadowing: âm đuôi và cụm phụ âm khó",
      intro:"Shadowing các video cô gửi. Mục tiêu: đọc đúng và rõ âm đuôi, đặc biệt các cụm khó như /ks/, /ts/, /tʃɪz/, /kst/, /sts/.",
      videos:[],
      how:`<ol class="outline"><li>Nghe cả đoạn một lần, chưa đọc theo.</li><li>Nghe từng câu, tạm dừng, đọc lại đúng nhịp và ngữ điệu.</li><li>Đọc đè theo video (đọc cùng lúc), chú ý âm cuối.</li><li>Ghi âm, nghe lại và so với video. Chỗ nào chưa rõ thì tập lại câu đó.</li></ol>`,
      sentences:[
        {html:"He fi<b>xed</b> si<b>x</b> old bi<b>kes</b>.", note:"/kst/ – /ks/ – /ks/: fixed /fɪkst/, six /sɪks/, bikes /baɪks/"},
        {html:"She wa<b>tches</b> the ma<b>tches</b> on wee<b>kends</b>.", note:"/tʃɪz/ – /tʃɪz/ – /ndz/"},
        {html:"<b>It's</b> <b>what's</b> left that cou<b>nts</b>.", note:"/ts/ – /ts/ – /nts/"},
        {html:"My frie<b>nds</b> a<b>sked</b> for the boo<b>ks</b>.", note:"/ndz/ – /skt/ – /ks/"},
        {html:"The ca<b>ts</b> sat on the bo<b>xes</b>.", note:"/ts/ – /ksɪz/"},
        {html:"He wor<b>ks</b> at a TV station and te<b>lls</b> great stor<b>ies</b>.", note:"/ks/ – /lz/ – /iz/"},
        {html:"Ne<b>xt</b> mo<b>nth</b> she te<b>sts</b> the te<b>xts</b>.", note:"/kst/ – /nθ/ – /sts/ – /ksts/: câu khó nhất, tập chậm trước"},
        {html:"I really li<b>ked</b> him, and we tal<b>ked</b> a lot.", note:"/kt/ – /kt/"},
        {html:"He rela<b>xed</b> and lau<b>ghed</b>.", note:"/kst/ – /ft/"},
        {html:"<b>That</b> was it. He took out a pa<b>ck</b> of cigare<b>ttes</b>.", note:"/ð/ – /k/ – /ts/"}
      ]},

    {id:"nghe-114", type:"listening", title:"Nghe 1.14: Buổi hẹn với Alexander", audio:"am-thanh/1.14.mp3",
      gist:{id:"gist", q:"Cô gái có muốn hẹn hò tiếp với Alexander không?", opts:["Có, cô ấy rất thích anh ấy", "Không, cô ấy chỉ muốn làm bạn", "Cô ấy chưa quyết định"], a:1, t:52.9,
        ex:"“I could imagine going to a concert or the theater with him, but <b>as a friend</b>. Sorry, Mom, but no.”"},
      qs:[
        {id:"q1", q:"What was her first impression of Alexander?", opts:["He was very shy", "He was much older than her", "He was very funny"], a:1, t:0, ex:"“My first impression of Alexander was that he was <b>much older than me</b>.”"},
        {id:"q2", kind:"gap", q:"In fact, he was ___ years old.", a:["32", "thirty-two", "thirty two"], t:6.4, ex:"“In fact, he was <b>32</b>, but I thought he was older.”"},
        {id:"q3", q:"What was his personality like?", opts:["Quiet and serious", "Extroverted and funny", "Shy but kind"], a:1, t:14.2, ex:"“He was <b>extroverted and funny</b>, and he had a very good sense of humor.”"},
        {id:"q4", kind:"gap", q:"He works for a ___ station.", a:["TV", "T.V.", "television"], t:22.2, ex:"“He works for a <b>TV station</b>, and he told me a lot of good stories about his work.”"},
        {id:"q5", q:"What were they both interested in?", opts:["Books and movies", "Sports and travel", "Art and music"], a:2, t:29, ex:"“He was also interested in the same things as me, <b>art and music</b>.”"},
        {id:"q6", kind:"tf", q:"Alexander was short and blond.", a:false, t:36.2, ex:"Sai. “He was <b>tall and dark</b> and very good-looking, and he had a nice smile.”"},
        {id:"q7", q:"Why didn't she want to date him again?", opts:["He was rude to her", "There wasn't any chemistry between them", "He talked too much about his work"], a:1, t:45.4, ex:"“But there just <b>wasn't any chemistry</b> between us.”"},
        {id:"q8", kind:"tf", q:"She could imagine going to a concert with him as a friend.", a:true, t:52.9, ex:"Đúng. “I could imagine going to a concert or the theater with him, but <b>as a friend</b>.”"},
        {id:"q9", q:"Who is she talking to?", opts:["Her best friend", "Her mom", "Alexander"], a:1, t:59, ex:"“Sorry, <b>Mom</b>, but no.” (Mẹ cô ấy là người chọn bạn hẹn cho cô.)"}
      ],
      transcript:[
        [0, "My <mark>first impression</mark> of Alexander was that he was much older than me. In fact, he was 32, but I thought he was older."],
        [14.2, "But when we started talking, I really liked him. He was <mark>extroverted</mark> and funny, and he had a very good <mark>sense of humor</mark>. He works for a <mark>TV station</mark>, and he told me a lot of good stories about his work."],
        [29, "He was also <mark>interested in</mark> the same things as me, art and music, and we talked a lot about that."],
        [36.2, "<mark>Physically</mark>, he wasn't really <mark>my type</mark>. It's hard to say why. He was tall and dark and very <mark>good-looking</mark>, and he had a nice smile. But there just wasn't any <mark>chemistry</mark> between us."],
        [52.9, "I could <mark>imagine</mark> going to a concert or the theater with him, but as a friend. Sorry, Mom, but no."]
      ]},

    {id:"nghe-115", type:"listening", title:"Nghe 1.15: Buổi hẹn với Oliver", audio:"am-thanh/1.15.mp3",
      gist:{id:"gist", q:"Cuối cùng cô ấy có muốn hẹn hò với Oliver không? Vì sao?", opts:["Có, họ hẹn gặp lại nhau", "Không, vì anh ấy hút thuốc", "Không, vì anh ấy không chịu trả tiền"], a:1, t:59.5,
        ex:"“He said, ‘Finally!’ and took out <b>a pack of cigarettes</b>. That was it. I could never have a boyfriend who was <b>a smoker</b>.”"},
      qs:[
        {id:"q1", q:"Compared to Alexander, Oliver looked…", opts:["older and more serious", "warmer and more attractive", "shorter and less friendly"], a:1, t:0, ex:"“I thought he looked <b>warm and friendly and more attractive</b> than Alexander.”"},
        {id:"q2", kind:"gap", q:"He was tall with short ___ hair and amazing blue eyes.", a:["blond", "blonde"], t:7, ex:"“He was tall with short <b>blond</b> hair, and he had amazing blue eyes, kind of like the actor Ryan Gosling.”"},
        {id:"q3", kind:"tf", q:"At first, Oliver was shy and quiet.", a:true, t:15.2, ex:"Đúng. “He was kind of <b>shy and quiet</b> at first, but when we started talking, he relaxed.”"},
        {id:"q4", q:"What did they have in common?", opts:["Books and movies", "Art and music", "Cooking and travel"], a:0, t:23, ex:"“We found we had a lot of things in common. We both liked <b>books and movies</b>.”"},
        {id:"q5", kind:"gap", q:"He was ___, too. He wanted to pay for everything.", a:["generous"], t:30.5, ex:"“He was <b>generous</b>, too. He wanted to pay for everything.”"},
        {id:"q6", kind:"tf", q:"She didn't enjoy the evening.", a:false, t:37.8, ex:"Sai. “I <b>really enjoyed</b> the evening.”"},
        {id:"q7", q:"When it was time to go, Oliver…", opts:["asked for her phone number", "called a taxi for her", "left without saying goodbye"], a:0, t:41, ex:"“He <b>asked for my phone number</b> and said he wanted to meet again.”"},
        {id:"q8", q:"What happened when they went to look for a taxi?", opts:["He got angry with the driver", "He took out a pack of cigarettes", "He forgot his wallet"], a:1, t:48, ex:"“He said, ‘Finally!’ and <b>took out a pack of cigarettes</b>.”"},
        {id:"q9", kind:"gap", q:"For her next date, she's going to ___ the man herself.", a:["choose"], t:68, ex:"“I think maybe for my next date I'm going to <b>choose</b> the man myself.”"}
      ],
      transcript:[
        [0, "When I first saw Oliver, I thought he looked <mark>warm</mark> and friendly and more <mark>attractive</mark> than Alexander. He was tall with short <mark>blond</mark> hair, and he had <mark>amazing</mark> blue eyes, <mark>kind of</mark> like the actor Ryan Gosling."],
        [15.2, "He was kind of <mark>shy</mark> and quiet at first, but when we started talking, he <mark>relaxed</mark>, and we found we <mark>had a lot of things in common</mark>. We both liked books and movies."],
        [30.5, "He was <mark>generous</mark>, too. He wanted to <mark>pay for</mark> everything. I really enjoyed the evening."],
        [41, "When it was time to go, he <mark>asked for</mark> my phone number and said he wanted to meet again. We walked out of the restaurant and went to look for a taxi, and then something happened, and I knew that it was impossible for me to <mark>go out with</mark> him."],
        [59.5, "He said, “Finally!” and took out <mark>a pack of cigarettes</mark>. <mark>That was it.</mark> I could never have a boyfriend who was a <mark>smoker</mark>."],
        [69, "I think maybe for my next <mark>date</mark> I'm going to <mark>choose</mark> the man myself. I don't think another person can really choose a <mark>partner</mark> for you."]
      ]},

    {id:"noi", type:"speaking", title:"Nói: bài nói mới về chủ đề hẹn hò",
      prompt:"Nói khoảng 1–2 phút: <b>Nếu là cô gái, bạn sẽ chọn Alexander hay Oliver? Vì sao?</b> Hoặc kể về một buổi hẹn (thật hoặc tưởng tượng) của bạn.",
      outline:[
        "Mở đầu: <i>I'd choose…</i> / <i>Let me tell you about a date I had…</i>",
        "Ấn tượng ban đầu: <i>My first impression was that…</i> · <i>He/She looked…</i>",
        "Tính cách và điểm chung: <i>He was extroverted / shy…</i> · <i>We had a lot in common: we both liked…</i>",
        "Chuyện gì đã xảy ra: <i>Then something happened…</i> · <i>At the end of the evening…</i>",
        "Kết luận: <i>That's why…</i> · <i>I think…</i>"
      ],
      phrases:["first impression", "looked warm and friendly", "extroverted", "shy and quiet", "a good sense of humor", "generous", "have a lot in common", "chemistry", "(not) my type", "go out with", "That was it."],
      checklist:[
        "Đuôi -ed của động từ quá khứ: liked /t/, talked /t/, started /ɪd/, wanted /ɪd/, enjoyed /d/.",
        "Đuôi -s: things /z/, books /s/, eyes /z/, movies /z/.",
        "Âm /θ/ trong think, things; âm /ð/ trong that, the, they.",
        "Nói chậm, rõ âm cuối, không thêm “ơ” sau phụ âm cuối."
      ],
      sample:"I'd choose Alexander. My first impression of Oliver was really good: he looked warm and friendly, and they had a lot in common. But I don't like smokers, so I agree with her. Alexander was a bit older, but he was extroverted and he had a great sense of humor. They both liked art and music, so I think they could have a lot of fun together. Maybe there wasn't any chemistry at first, but chemistry can grow. That's why I'd give him a second chance."},

    {id:"luyen-duoi", type:"quiz", title:"Luyện tập: đọc đuôi -ED và -S/ES",
      intro:"Chọn cách đọc đúng. Bấm 🔊 để nghe từ, rồi tự đọc to trước khi chọn.",
      qs:[
        drill("q1", "stopped", "-ed", 1, "stop kết thúc bằng /p/ (vô thanh) → /t/: /stɑːpt/"),
        drill("q2", "needed", "-ed", 0, "need kết thúc bằng /d/ → /ɪd/: /ˈniːdɪd/"),
        drill("q3", "called", "-ed", 2, "call kết thúc bằng /l/ (hữu thanh) → /d/: /kɔːld/"),
        drill("q4", "laughed", "-ed", 1, "laugh kết thúc bằng âm /f/ (gh) → /t/: /læft/"),
        drill("q5", "visited", "-ed", 0, "visit kết thúc bằng /t/ → /ɪd/: /ˈvɪzɪtɪd/"),
        drill("q6", "opened", "-ed", 2, "open kết thúc bằng /n/ → /d/: /ˈoʊpənd/"),
        drill("q7", "cats", "-s", 0, "cat kết thúc bằng /t/ (vô thanh) → /s/: /kæts/"),
        drill("q8", "dogs", "-s", 1, "dog kết thúc bằng /ɡ/ (hữu thanh) → /z/: /dɔːɡz/"),
        drill("q9", "buses", "-es", 2, "bus kết thúc bằng /s/ → /ɪz/: /ˈbʌsɪz/"),
        drill("q10", "months", "-s", 0, "month kết thúc bằng /θ/ (vô thanh) → /s/: /mʌnθs/"),
        drill("q11", "changes", "-es", 2, "change kết thúc bằng /dʒ/ → /ɪz/: /ˈtʃeɪndʒɪz/"),
        drill("q12", "eyes", "-s", 1, "eye kết thúc bằng nguyên âm → /z/: /aɪz/")
      ]}
  ],

  test:{qs:[
    {id:"t1", tag:"IPA", q:"Từ nào có âm /θ/?", opts:["this", "think", "then"], a:1, ex:"think /θɪŋk/: lưỡi giữa hai răng, thổi hơi, không rung. this và then có âm /ð/ (rung)."},
    {id:"t2", tag:"IPA", q:"Từ nào có âm /æ/?", opts:["cut", "car", "cat"], a:2, ex:"cat /kæt/. cut có /ʌ/, car có /ɑː/."},
    {id:"t3", tag:"IPA", q:"Âm /ʃ/ có trong từ nào?", opts:["she", "see", "chair"], a:0, ex:"she /ʃiː/. see có /s/, chair có /tʃ/."},
    {id:"t4", tag:"IPA", q:"Âm nào là âm hữu thanh (cổ họng rung khi đọc)?", ipa:true, opts:["/s/", "/f/", "/z/"], a:2, ex:"/z/ rung cổ họng; /s/ và /f/ là âm vô thanh."},
    {id:"t5", tag:"IPA", q:"Khi đọc /θ/ và /ð/, đầu lưỡi đặt ở đâu?", opts:["Giữa hai hàm răng", "Chạm lợi phía sau răng cửa trên", "Cong lên, không chạm vào đâu"], a:0, ex:"/θ/ và /ð/: đầu lưỡi đặt giữa hai hàm răng. Chạm lợi trên là /t/, /d/; cong lưỡi là /r/."},
    {id:"t6", tag:"IPA", q:"Từ nào có nguyên âm dài /iː/?", opts:["sit", "seat", "set"], a:1, ex:"seat /siːt/. sit /sɪt/ là âm ngắn, set /set/."},
    {id:"t7", tag:"-ED", q:"Đuôi -ed trong <b>watched</b> đọc là?", ipa:true, opts:ED_OPTS, a:1, say:"watched", ex:"watch kết thúc bằng /tʃ/ (vô thanh) → /t/: /wɑːtʃt/."},
    {id:"t8", tag:"-ED", q:"Đuôi -ed trong <b>decided</b> đọc là?", ipa:true, opts:ED_OPTS, a:0, say:"decided", ex:"decide kết thúc bằng /d/ → /ɪd/: /dɪˈsaɪdɪd/."},
    {id:"t9", tag:"-ED", q:"Đuôi -ed trong <b>played</b> đọc là?", ipa:true, opts:ED_OPTS, a:2, say:"played", ex:"play kết thúc bằng nguyên âm → /d/: /pleɪd/."},
    {id:"t10", tag:"-ED", q:"Từ nào có đuôi -ed đọc khác các từ còn lại?", opts:["wanted", "needed", "looked"], a:2, ex:"looked /lʊkt/ đọc /t/; wanted và needed đọc /ɪd/."},
    {id:"t11", tag:"-S/ES", q:"Đuôi -es trong <b>watches</b> đọc là?", ipa:true, opts:ES_OPTS, a:2, say:"watches", ex:"watch kết thúc bằng /tʃ/ (âm xuýt) → /ɪz/: /ˈwɑːtʃɪz/."},
    {id:"t12", tag:"-S/ES", q:"Đuôi -s trong <b>books</b> đọc là?", ipa:true, opts:ES_OPTS, a:0, say:"books", ex:"book kết thúc bằng /k/ (vô thanh) → /s/: /bʊks/."},
    {id:"t13", tag:"-S/ES", q:"Đuôi -s trong <b>plays</b> đọc là?", ipa:true, opts:ES_OPTS, a:1, say:"plays", ex:"play kết thúc bằng nguyên âm → /z/: /pleɪz/."},
    {id:"t14", tag:"-S/ES", q:"Từ nào có đuôi đọc là /ɪz/?", opts:["cats", "boxes", "dogs"], a:1, ex:"boxes /ˈbɑːksɪz/ (box kết thúc bằng /ks/). cats đọc /s/, dogs đọc /z/."},
    {id:"t15", tag:"Từ vựng", q:"“There wasn't any <b>chemistry</b> between us” nghĩa là gì?", opts:["Hai người không hợp nhau, không có rung động", "Hai người không học môn hóa", "Hai người không nói chuyện với nhau"], a:0, ex:"chemistry (giữa hai người) = sự hợp nhau, cảm giác rung động."},
    {id:"t16", tag:"Từ vựng", kind:"gap", q:"He was ___: he wanted to pay for everything.", a:["generous"], ex:"generous = hào phóng."},
    {id:"t17", tag:"Từ vựng", kind:"gap", q:"We found we had a lot of things in ___.", a:["common"], ex:"have a lot (of things) in common = có nhiều điểm chung."},
    {id:"t18", tag:"Nghe", clip:true, audio:"am-thanh/1.14.mp3", t:45.4, q:"Why didn't she want to date Alexander again?", opts:["He was too old", "There wasn't any chemistry between them", "He was rude"], a:1, ex:"“But there just wasn't any chemistry between us.”"},
    {id:"t19", tag:"Nghe", clip:true, audio:"am-thanh/1.15.mp3", t:59.5, q:"What did Oliver do that ended everything?", opts:["He forgot his wallet", "He took out a pack of cigarettes", "He called another girl"], a:1, ex:"“He said, ‘Finally!’ and took out a pack of cigarettes. That was it.”"},
    {id:"t20", tag:"Nghe", clip:true, audio:"am-thanh/1.14.mp3", t:22.2, kind:"gap", q:"Alexander works for a ___ station.", a:["TV", "T.V.", "television"], ex:"“He works for a TV station.”"}
  ]}
});
})();
