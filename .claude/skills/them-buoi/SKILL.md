---
name: them-buoi
description: Biến tài liệu một buổi học tiếng Anh (ghi chú, ảnh sách, mp3, link YouTube, bài tập về nhà) thành buổi học hoàn chỉnh trên trang Sổ học tiếng Anh: Học, thẻ ôn, bài tập, kiểm tra, rồi commit và push. Use when the user sends class materials or homework, drops files into tai-lieu/buoi-NN, or says "làm buổi N", "buổi mới", "thêm buổi", "hôm nay học…", "bài tập về nhà…".
---

# Thêm buổi học

Người dùng chỉ gửi tài liệu, phần còn lại tự làm hết. **Đừng hỏi han, đừng giải thích dài.** Chỉ hỏi khi thật sự thiếu thứ không đoán được, và hỏi gộp một lần. Báo cáo cuối tối đa 4 dòng.

## Quy trình

1. **Xác định buổi:**
   - Có số buổi trong lời nhắn thì dùng số đó.
   - Nếu không: lấy thư mục `tai-lieu/buoi-NN/` chưa có `So_hoc_tieng_Anh/du-lieu/buoi-NN.js`.
   - Nếu cũng không có: dùng số buổi lớn nhất + 1.
2. **Gom tài liệu vào `tai-lieu/buoi-NN/`:**
   - File gửi qua chat thì chép vào đây.
   - Lời nhắn thì ghi thành `noi-dung.md` theo `tai-lieu/MAU.md`, giữ nguyên ý người dùng.
   - Đọc hết tài liệu, kể cả ảnh và PDF.
3. **Âm thanh** (nếu có bài nghe):
   - Nén: `bash .claude/skills/them-buoi/scripts/nen_am_thanh.sh "<file gốc>" <tên>`. Đặt tên theo số track trong sách, ví dụ `1.20`. Bài trong đĩa lấy từ `CD 1/` (chỉ có trên máy).
   - Chép lời: `.venv/bin/python .claude/skills/them-buoi/scripts/chep_loi.py So_hoc_tieng_Anh/am-thanh/<tên>.mp3`. Thêm `--words` khi cần mốc `t` chính xác.
   - Chưa có `.venv` thì chạy: `python3 -m venv .venv && .venv/bin/pip install faster-whisper numpy`.
   - Đọc lại transcript và sửa chỗ máy nghe sai.
4. **Viết `So_hoc_tieng_Anh/du-lieu/buoi-NN.js`** đạt chuẩn trong [CHUAN.md](CHUAN.md). Đọc `buoi-01.js` làm mẫu. Buổi mới phải đầy đủ ngang Buổi 1.
5. **Gắn vào trang:** thêm `<script src="du-lieu/buoi-NN.js"></script>` vào `So_hoc_tieng_Anh/Mo_trang_hoc.html`, ngay sau dòng của buổi trước.
6. **Kiểm tra tự động:** `node .claude/skills/them-buoi/scripts/kiem_tra_buoi.mjs So_hoc_tieng_Anh/du-lieu/buoi-NN.js`.
   - Sửa đến khi in ra `OK`.
   - Xem lại các CẢNH BÁO; cảnh báo nào chấp nhận được thì để nguyên.
7. **Kiểm tra trong trình duyệt** (preview server `english-pages`, mở http://localhost:8765/):
   - Trang chủ có buổi mới.
   - Tab Học, Bài tập, Kiểm tra hiển thị đúng.
   - Nộp thử một bài tập và bài kiểm tra.
   - File nghe phát được; nút "nghe đoạn" tua đúng chỗ.
   - Không có lỗi console.
   - Xong thì chạy `localStorage.removeItem("sohoc-v1")` để xoá dữ liệu thử.
8. **Lưu:**
   - Cập nhật mục "Việc đang chờ" trong `CLAUDE.md` nếu còn thiếu gì, ví dụ link video.
   - `git add -A && git commit -m "Buổi NN: <title>"` (kèm dòng Co-Authored-By), rồi `git push`.

## Khi thiếu tài liệu

- Thiếu link video shadowing: vẫn làm bài shadowing với `videos: []`, ghi vào "Việc đang chờ".
- Không rõ track nghe, hoặc không có nội dung bài học: hỏi lại người dùng (một câu duy nhất), làm trước các phần khác.
- Cô giao dạng bài lạ: chọn loại bài gần nhất (`quiz`, `speaking`…). Chỉ sửa engine `Mo_trang_hoc.html` khi không loại nào dùng được, và giữ tương thích với buổi cũ.

## Không được

- Sửa file buổi cũ, trừ khi người dùng nhờ (ví dụ thêm link vào Buổi 1).
- Đổi id đã đưa lên.
- Thêm thư viện, CDN hay bước build. Trang phải chạy được khi mở file offline.

## Báo cáo cuối (ngắn)

```
Đã thêm Buổi N: <title>. <X> thẻ · <Y> câu bài tập · <Z> câu kiểm tra. Đã push.
Còn thiếu: <… hoặc bỏ dòng này>
```
