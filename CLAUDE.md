# CLAUDE.md: Sổ học tiếng Anh

Hướng dẫn cho Claude (và người bảo trì) khi làm việc trong repo này.

## Dự án là gì

Người dùng là người Việt, đang đi học tiếng Anh theo **từng buổi**. Sau mỗi buổi họ gửi nội dung đã học và bài tập về nhà; Claude đưa nội dung đó vào **một trang web tĩnh** để họ:

- **Học** lại bài trên lớp,
- làm **Bài tập** (nghe, trắc nghiệm, shadowing, nói),
- **Ôn tập** ngắt quãng (thẻ + câu từng sai), ôn **toàn bộ một buổi**,
- xem **Sổ lỗi sai** và làm lại,
- làm **Kiểm tra** cuối buổi.

Không có backend, không build step, không thư viện ngoài. Mở file trực tiếp (`file://`) hoặc đặt trên server tĩnh đều chạy.

**Ưu tiên học tập hiện tại:** phát âm /t/ và /d/ trước tiên (video: https://www.youtube.com/watch?v=QpYxHp6YM2I).

## Cấu trúc

```
index.html                     chuyển hướng sang So_hoc_tieng_Anh/Mo_trang_hoc.html
So_hoc_tieng_Anh/
  Mo_trang_hoc.html            "engine": toàn bộ HTML/CSS/JS của ứng dụng (một file)
  du-lieu/buoi-NN.js           dữ liệu từng buổi học (mỗi buổi một file)
  am-thanh/*.mp3               âm thanh đã nén (96 kbps mono)
tai-lieu/
  MAU.md                       mẫu ghi nội dung một buổi (người dùng điền)
  buoi-NN/noi-dung.md (+ ảnh, mp3, PDF)   tài liệu gốc từng buổi: đầu vào để làm du-lieu/buoi-NN.js
Nghe_1.14-1.15.html            trang cũ, độc lập (mp3 nhúng base64), đã được Buổi 1 thay thế
deploy/nginx.conf, Dockerfile, docker-compose.yml   triển khai lên server
.claude/launch.json            preview server "english-pages" (python3 -m http.server 8765)
```

Không có trong git (xem `.gitignore`): `CD 1/` (đĩa gốc 114 MB), `.superpowers/`, `Kho_the.html` (trang cũ chạy trên claude.ai).

## Kiến trúc engine (`Mo_trang_hoc.html`)

- SPA định tuyến bằng hash: `#` (trang chủ), `#b01`, `#b01/hoc`, `#b01/bai-tap`, `#b01/kiem-tra`, `#on-tap`, `#loi-sai`.
- Thứ tự script: `window.COURSE = []` → các `<script src="du-lieu/buoi-NN.js">` → script ứng dụng (IIFE).
- **Tiến độ** lưu ở `localStorage["sohoc-v1"]`: `{srs, wrong, done, scores, tests, links, newLimit, full?}`. Mọi truy cập bọc try/catch; có xuất/nhập bản sao lưu JSON `{app:"so-hoc-tieng-anh", v:1, savedAt, data}` ở trang chủ.
- **Ghi âm** lưu ở IndexedDB `sohoc-ghiam` (store `recs`, index `ex`), dự phòng trong bộ nhớ. Dùng `MediaRecorder` + `getUserMedia`, nên **chỉ chạy trong secure context** (https, localhost, file://).
- **Ôn ngắt quãng** kiểu SM-2: Quên/Khó/Nhớ/Dễ. Quên → đến hạn sau 10 phút và quay lại trong lượt; Nhớ → 1 → 3 → ivl × ease ngày; Dễ → 3 ngày, ease +0.15. Thẻ mới xen kẽ giữa các bộ thẻ, giới hạn bởi `newLimit`.
- **Ôn toàn bộ buổi** (`mode:"full"`): mọi thẻ + câu bài tập + câu kiểm tra của một buổi, chọn từng phần, dừng/tiếp tục qua `S.full`.
- Phát âm mẫu bằng `speechSynthesis` (en-US). Đoạn nghe phát bằng `new Audio(src)` rồi tua tới `t`.
- ID toàn cục: thẻ `"<sid>:<cardId>"`; câu hỏi `"<sid>:<exId>:<qId>"`, câu kiểm tra `"<sid>:test:<qId>"`.

## Định dạng một buổi học (`du-lieu/buoi-NN.js`)

```js
(() => {
window.COURSE.push({
  id: "b02", no: 2, date: "2026-11-11",
  title: "…", summary: "…", homeworkNote: "…",
  decks: [{id: "vocab", name: "Từ vựng"}],          // card.deck trỏ tới đây
  cards: [ /* xem loại thẻ bên dưới */ ],
  learn: [ /* khối nội dung trang Học */ ],
  exercises: [ /* bài tập */ ],
  test: { qs: [ /* ~15–20 câu */ ] }
});
})();
```

**Thẻ** (`cards[]`, mỗi thẻ có `id`, `deck`, `type`, `front`, `back`):
- `vocab`: `front` (từ), `ipa`, `pos`, `back` (nghĩa tiếng Việt), `example` (HTML, dùng `<mark>`).
- `note`: thẻ quy tắc; `front`, `back`, `example` dạng HTML.
- `ipa`: `front` (ký hiệu, không có dấu /), `w` (từ ví dụ), `wi` (phiên âm từ), `back` (cách đặt lưỡi/môi).
- `pick`: `prompt`, `front`, `opts`, `a` (chỉ số), `ipa`, `back` (vì sao), `example`.

Xem `buoi-01.js` (dòng tạo `cards`) làm mẫu.

**Khối Học** (`learn[]`): `{type:"html", title, html}` · `{type:"ipa", groups:[{title, note, sounds:[{s, w, wi, tip, more}]}]}` · `{type:"cards"}` (nút ôn thẻ của buổi).

**Bài tập** (`exercises[]`, mỗi bài có `id`, `type`, `title`):
- `listening`: `audio, gist, qs, transcript`. Câu hỏi có `t` (giây) thì có nút nghe lại đoạn đó.
- `quiz`: `qs`.
- `shadowing`: `intro, videos:[{title,url}], how, sentences:[{html, note}]`. **Chỉ cần ghi âm**, không chấm điểm.
- `speaking`: `prompt, outline, phrases, checklist, sample`, có ghi âm.

**Câu hỏi**: `{id, q, opts, a, ex}` (mặc định trắc nghiệm, `a` là chỉ số) · `kind:"gap"` với `a:["đáp án", "biến thể"…]` (so sánh không phân biệt hoa thường/dấu câu) · `kind:"tf"` với `a:true|false`. Tuỳ chọn: `tag`, `say` (nút 🔊), `t` + `audio` + `clip:true` (nút “Nghe đoạn liên quan”).

## Quy trình thêm buổi mới (từ Buổi 2 trở đi)

### Đầu vào: thư mục `tai-lieu/buoi-NN/`

Người dùng đưa tài liệu buổi học vào repo theo một trong hai cách:
- **Qua git:** tạo `tai-lieu/buoi-NN/`, chép `tai-lieu/MAU.md` thành `noi-dung.md` và điền (học gì, bài tập về nhà, ghi chú), bỏ kèm ảnh sách, mp3, PDF, rồi push và nhắn "làm buổi NN".
- **Qua chat:** gửi nội dung và file trực tiếp. Khi đó Claude tự tạo `tai-lieu/buoi-NN/noi-dung.md` từ lời người dùng (giữ nguyên ý, gạch đầu dòng) để repo luôn có bản gốc.

Ví dụ đã điền: `tai-lieu/buoi-01/noi-dung.md`. Khi được nhờ "làm buổi mới" mà không nói số buổi: tìm thư mục `tai-lieu/buoi-NN/` chưa có `So_hoc_tieng_Anh/du-lieu/buoi-NN.js` tương ứng. Chỗ nào trong tài liệu không rõ (chưa có link video, không rõ track nào) thì hỏi lại, đừng đoán bừa; phần thiếu mà không chặn việc khác thì làm trước phần còn lại và ghi vào "Việc đang chờ".

### Các bước

1. Đọc hết `tai-lieu/buoi-NN/` (cả ảnh, PDF). Nghe/chép lời file mp3 nếu có bài nghe.
2. Âm thanh: nén vào `So_hoc_tieng_Anh/am-thanh/` (đặt tên theo số track trong sách, ví dụ `1.20.mp3`):
   `ffmpeg -i "<file gốc>" -ac 1 -b:a 96k So_hoc_tieng_Anh/am-thanh/1.20.mp3`
   Transcript dùng faster-whisper (`medium.en`, lấy cả mốc thời gian để gắn `t` cho câu hỏi), giải mã bằng ffmpeg ra numpy (PyAV bản hiện tại lỗi `metadata_errors`). Bài nghe trong `CD 1/` (chỉ có trên máy, không có trong git) thì lấy từ đó.
3. Viết `So_hoc_tieng_Anh/du-lieu/buoi-NN.js` đạt **Chuẩn mỗi buổi** bên dưới.
4. Thêm `<script src="du-lieu/buoi-NN.js"></script>` vào `Mo_trang_hoc.html`, ngay sau dòng của buổi trước.
5. Kiểm tra trong trình duyệt qua preview server `english-pages` (http://localhost:8765/So_hoc_tieng_Anh/Mo_trang_hoc.html): trang chủ có buổi mới; tab Học, Bài tập, Kiểm tra hiển thị đúng; nộp thử bài tập và bài kiểm tra; âm thanh phát được và nút "nghe đoạn" tua đúng chỗ; "Ôn toàn bộ buổi này" đếm đủ số mục; không lỗi console. Xong thì xoá dữ liệu thử (`localStorage.removeItem("sohoc-v1")`).
6. Cập nhật mục "Việc đang chờ" bên dưới, rồi commit (`Buổi NN: <chủ đề>`) và push. Server chỉ cần `git pull` (Docker: `docker compose up -d --build`).

### Chuẩn mỗi buổi (làm giống Buổi 1)

Buổi 1 (`buoi-01.js`) là mẫu chuẩn; buổi mới phải đầy đủ tương đương:

| Phần | Yêu cầu |
|---|---|
| `title`, `summary`, `homeworkNote` | Tiêu đề ngắn các chủ đề (nối bằng " · "), tóm tắt 1 câu, nhắc lại đúng bài tập cô giao |
| **Học** (`learn`) | Mỗi chủ đề trên lớp một khối, giải thích bằng tiếng Việt dễ hiểu, có bảng/ví dụ, tô `<b>`/`<mark>` chỗ cần nhớ; phát âm thì nói rõ vị trí lưỡi, môi, so với âm tiếng Việt. Khối cuối luôn là `{type:"cards"}` |
| **Thẻ** (`decks`, `cards`) | Mỗi chủ đề một bộ thẻ. Quy tắc → thẻ `note`; chỗ phải phân biệt/chọn → thẻ `pick` (đủ nhiều để luyện, Buổi 1 có 20–27 thẻ mỗi bộ); từ vựng mới (từ bài nghe, bài đọc, cô cho) → thẻ `vocab` có IPA, từ loại, nghĩa, câu ví dụ lấy từ bài |
| **Bài tập** (`exercises`) | Mỗi bài cô giao là một bài tập, đúng thứ tự cô giao. Nghe: câu `gist` + ~8–10 câu (trắc nghiệm, điền từ, đúng/sai) có `t` + transcript đầy đủ. Shadowing: link video + 8–10 câu luyện có ghi chú âm khó, chỉ ghi âm. Nói/viết: đề, dàn ý, cụm từ nên dùng, checklist, bài mẫu. Thêm một bài `quiz` ~10–12 câu luyện kiến thức mới học |
| **Kiểm tra** (`test`) | 15–20 câu trộn tất cả chủ đề của buổi, mỗi câu có `tag` và `ex` giải thích; có câu nghe (`clip:true`) nếu buổi có bài nghe; có vài câu điền từ |
| Ôn tập | Không cần làm gì thêm: Ôn tập hằng ngày và "Ôn toàn bộ buổi này" tự lấy mọi thẻ và câu hỏi của buổi |

Đặt id theo cùng kiểu Buổi 1: buổi `bNN`; thẻ `<deck>-…` (ví dụ `v-01`, `ed-walked`); bài tập theo tên ngắn (`nghe-120`, `noi`, `luyen-…`); câu hỏi `q1…`, câu kiểm tra `t1…`.

## Quy tắc quan trọng

- **Không đổi `id`** của buổi, thẻ, bài tập, câu hỏi đã phát hành: tiến độ của người dùng gắn với các id này. Sửa nội dung thì giữ id; bỏ câu thì xoá hẳn, đừng dùng lại id cũ cho câu khác.
- **Không sửa file buổi cũ** khi thêm buổi mới (trừ khi người dùng yêu cầu, ví dụ thêm link shadowing cho Buổi 1).
- Mọi chữ trên giao diện bằng **tiếng Việt**; nội dung tiếng Anh giữ nguyên. Giải thích phát âm theo cách người Việt dễ hiểu (vị trí lưỡi, môi, so sánh với âm tiếng Việt).
- Ôn tập phải nằm **trong chính trang web này** (người dùng không muốn trang online riêng).
- Engine là một file, không thêm framework/CDN; trang phải chạy được cả khi mở offline bằng `file://`.
- Nội dung trong `am-thanh/` và transcript lấy từ giáo trình của người dùng: chỉ dùng cho việc học cá nhân.

## Việc đang chờ

- Link YouTube shadowing cho Buổi 1 (người dùng sẽ gửi sau) → thêm vào `videos` của bài `shadow` trong `buoi-01.js`.
- Buổi 2 trở đi: chờ người dùng đưa tài liệu vào `tai-lieu/buoi-02/` hoặc gửi qua chat.
