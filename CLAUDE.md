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

## Quy trình thêm buổi mới

1. Người dùng gửi nội dung buổi học + bài tập (có thể kèm mp3, link YouTube, ảnh sách).
2. Tạo `So_hoc_tieng_Anh/du-lieu/buoi-NN.js` theo định dạng trên: nội dung Học, thẻ (luôn có bộ phát âm nếu buổi có phần phát âm, kèm từ vựng), bài tập theo đúng bài cô giao, bài kiểm tra 15–20 câu trộn từ cả buổi.
3. Thêm một dòng `<script src="du-lieu/buoi-NN.js"></script>` vào `Mo_trang_hoc.html`, ngay sau các dòng buổi trước.
4. Âm thanh mới: nén rồi đặt vào `am-thanh/`:
   `ffmpeg -i "CD 1/14 Track 14.mp3" -ac 1 -b:a 96k So_hoc_tieng_Anh/am-thanh/1.14.mp3`
   Cần transcript thì dùng faster-whisper (`medium.en`), giải mã bằng ffmpeg ra numpy (PyAV bản hiện tại lỗi `metadata_errors`).
5. Kiểm tra trong trình duyệt qua preview server `english-pages` (http://localhost:8765/So_hoc_tieng_Anh/Mo_trang_hoc.html): trang chủ, ba tab, nộp bài, ôn tập, không lỗi console. Xoá dữ liệu thử (`localStorage.removeItem("sohoc-v1")`) sau khi test.
6. Commit và push; server chỉ cần `git pull` (hoặc build lại Docker).

## Quy tắc quan trọng

- **Không đổi `id`** của buổi, thẻ, bài tập, câu hỏi đã phát hành: tiến độ của người dùng gắn với các id này. Sửa nội dung thì giữ id; bỏ câu thì xoá hẳn, đừng dùng lại id cũ cho câu khác.
- **Không sửa file buổi cũ** khi thêm buổi mới (trừ khi người dùng yêu cầu, ví dụ thêm link shadowing cho Buổi 1).
- Mọi chữ trên giao diện bằng **tiếng Việt**; nội dung tiếng Anh giữ nguyên. Giải thích phát âm theo cách người Việt dễ hiểu (vị trí lưỡi, môi, so sánh với âm tiếng Việt).
- Ôn tập phải nằm **trong chính trang web này** (người dùng không muốn trang online riêng).
- Engine là một file, không thêm framework/CDN; trang phải chạy được cả khi mở offline bằng `file://`.
- Nội dung trong `am-thanh/` và transcript lấy từ giáo trình của người dùng: chỉ dùng cho việc học cá nhân.

## Việc đang chờ

- Link YouTube shadowing cho Buổi 1 (người dùng sẽ gửi sau) → thêm vào `videos` của bài `shadow` trong `buoi-01.js`.
- Buổi 2 trở đi: chờ người dùng gửi nội dung.
