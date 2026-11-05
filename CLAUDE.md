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
.claude/skills/them-buoi/      skill thêm buổi mới (quy trình, chuẩn, script)
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

## Thêm buổi học mới → skill `them-buoi`

Mỗi khi người dùng gửi tài liệu buổi học (ghi chú, ảnh, mp3, link, bài tập) hoặc nói "làm buổi N", dùng skill **`.claude/skills/them-buoi/`**:
- `SKILL.md`: quy trình từng bước.
- `CHUAN.md`: chuẩn nội dung và định dạng `buoi-NN.js`.
- `scripts/`: nén âm thanh, chép lời, kiểm tra file buổi học.

Tài liệu gốc từng buổi lưu ở `tai-lieu/buoi-NN/`. Mẫu ghi chú là `tai-lieu/MAU.md`.

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
