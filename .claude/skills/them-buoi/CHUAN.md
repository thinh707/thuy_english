# Chuẩn một buổi học và định dạng `buoi-NN.js`

Mẫu chuẩn: `So_hoc_tieng_Anh/du-lieu/buoi-01.js`. Đọc nó trước khi viết buổi mới và làm giống cách trình bày.

## Chuẩn nội dung

| Phần | Yêu cầu |
|---|---|
| `title`, `summary`, `homeworkNote` | `title`: các chủ đề nối bằng " · ". `summary`: 1 câu. `homeworkNote`: nhắc lại đúng bài cô giao |
| **Học** (`learn`) | Mỗi chủ đề trên lớp là một khối, giải thích bằng tiếng Việt dễ hiểu, có bảng và ví dụ, tô `<b>` hoặc `<mark>` chỗ cần nhớ. Phần phát âm thì nói rõ vị trí lưỡi và môi, so với âm tiếng Việt. Khối cuối luôn là `{type:"cards"}` |
| **Thẻ** (`decks`, `cards`) | Mỗi chủ đề một bộ. Quy tắc → `note`. Chỗ phải phân biệt hay chọn → `pick` (khoảng 20 thẻ một bộ). Từ vựng mới (từ bài nghe, bài đọc, từ cô cho) → `vocab` có IPA, từ loại, nghĩa và câu ví dụ lấy từ bài |
| **Bài tập** (`exercises`) | Mỗi bài cô giao là một bài tập, theo đúng thứ tự cô giao. **Nghe**: câu `gist` + 8–10 câu (trắc nghiệm, điền từ, đúng/sai) có `t` + transcript đầy đủ. **Shadowing**: link video + 8–10 câu luyện, ghi chú âm khó; chỉ cần ghi âm. **Nói/viết**: đề, dàn ý, cụm từ nên dùng, checklist, bài mẫu. Thêm một bài `quiz` 10–12 câu luyện kiến thức mới |
| **Kiểm tra** (`test`) | 15–20 câu trộn mọi chủ đề, câu nào cũng có `tag` và `ex`. Có câu nghe (`clip:true`) nếu buổi có bài nghe. Có vài câu điền từ |
| Ôn tập | Không cần làm gì thêm. Ôn hằng ngày và "Ôn toàn bộ buổi này" tự lấy mọi thẻ và câu hỏi |

Viết toàn bộ chữ giao diện bằng tiếng Việt, giữ nguyên tiếng Anh. Ưu tiên của người học là phát âm (/t/, /d/, âm đuôi), nên khi buổi học có từ mới thì thêm IPA và lưu ý phát âm.

## Khung file

```js
/* Buổi N: <title> */
(() => {
window.COURSE.push({
  id: "b02", no: 2, date: "2026-11-11",
  title: "…", summary: "…", homeworkNote: "…",
  decks: [{id: "vocab", name: "Từ vựng 1.20"}],
  cards: [ … ],
  learn: [ … ],
  exercises: [ … ],
  test: { qs: [ … ] }
});
})();
```

## Thẻ (`cards[]`)

Mọi thẻ có `id`, `deck`, `type`, `front`, `back`.
- `vocab`: `front` (từ), `ipa`, `pos`, `back` (nghĩa tiếng Việt), `example` (HTML, từ đang học bọc trong `<mark>`).
- `note`: thẻ quy tắc. `front`, `back` và `example` đều là HTML.
- `ipa`: `front` (ký hiệu, không có dấu /), `w` (từ ví dụ), `wi` (phiên âm của từ đó), `back` (cách đặt lưỡi và môi).
- `pick`: `prompt`, `front`, `opts`, `a` (chỉ số đáp án), `ipa`, `back` (vì sao), `example`.

## Khối Học (`learn[]`)

- `{type:"html", title, html}`
- `{type:"ipa", groups:[{title, note, sounds:[{s, w, wi, tip, more}]}]}`
- `{type:"cards"}`

## Bài tập (`exercises[]`)

Mọi bài có `id`, `type`, `title` (không dùng id `test`).
- `listening`: `audio` ("am-thanh/1.20.mp3"), `gist` (một câu hỏi, `id:"gist"`), `qs`, `transcript: [[giây, "câu HTML"], …]`.
- `quiz`: `qs`.
- `shadowing`: `intro`, `videos:[{title, url}]`, `how` (HTML), `sentences:[{html, note}]`.
- `speaking`: `prompt` (HTML), `outline[]`, `phrases[]`, `checklist[]`, `sample`.

## Câu hỏi

- Trắc nghiệm (mặc định): `{id, q, opts, a, ex}`, trong đó `a` là chỉ số đáp án.
- `kind:"gap"`: `a:["đáp án", "biến thể", …]`. Không phân biệt hoa thường và dấu câu.
- `kind:"tf"`: `a:true` hoặc `a:false`.
- Tuỳ chọn:
  - `tag`: bắt buộc ở bài kiểm tra.
  - `say`: hiện nút 🔊.
  - `t` (giây): trong bài nghe, câu tự lấy `audio` của bài.
  - `clip:true` + `audio` + `t`: hiện nút "Nghe đoạn liên quan", dùng trong bài kiểm tra.

## Đặt id

- Buổi: `bNN`.
- Thẻ: `<tiền tố bộ>-…`, ví dụ `v-01`, `ed-walked`.
- Bài tập: tên ngắn, ví dụ `nghe-120`, `noi`, `luyen-…`.
- Câu hỏi: `q1…`. Câu kiểm tra: `t1…`.

**Không bao giờ đổi id đã đưa lên**, vì tiến độ học gắn với id. Sửa nội dung thì giữ nguyên id. Câu nào bỏ thì xoá hẳn, và không dùng lại id đó cho câu khác.
