# Sổ học tiếng Anh

Trang web học tiếng Anh theo từng buổi: **Học** lại bài trên lớp, làm **Bài tập** (nghe, trắc nghiệm, shadowing có ghi âm, nói), **Ôn tập** ngắt quãng bằng thẻ, **Sổ lỗi sai** và **Kiểm tra** cuối buổi.

Trang tĩnh thuần HTML/JS: không cần cài đặt, không cần cơ sở dữ liệu.

## Dùng trên máy

Mở file `So_hoc_tieng_Anh/Mo_trang_hoc.html` bằng Chrome (nhấp đúp là được).

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `So_hoc_tieng_Anh/Mo_trang_hoc.html` | Ứng dụng (giao diện + xử lý) |
| `So_hoc_tieng_Anh/du-lieu/buoi-NN.js` | Nội dung từng buổi học |
| `So_hoc_tieng_Anh/am-thanh/` | File nghe đã nén |
| `index.html` | Mở tên miền là vào thẳng trang học |
| `Nghe_1.14-1.15.html` | Trang nghe cũ (bản độc lập) |
| `deploy/nginx.conf`, `Dockerfile`, `docker-compose.yml` | Triển khai lên server |
| `CLAUDE.md` | Hướng dẫn cho Claude khi thêm buổi mới |

## Triển khai lên server

### Cách 1: Docker (dễ nhất)

```bash
git clone https://github.com/thinh707/thuy_english.git
cd thuy_english
docker compose up -d --build
```

Trang chạy ở `http://<địa-chỉ-server>:8080`. Khi có buổi mới:

```bash
git pull && docker compose up -d --build
```

### Cách 2: nginx có sẵn trên server

```bash
sudo git clone https://github.com/thinh707/thuy_english.git /var/www/thuy_english
sudo cp /var/www/thuy_english/deploy/nginx.conf /etc/nginx/sites-available/thuy_english
# Sửa trong file vừa chép: root /var/www/thuy_english;  server_name tên-miền-của-bạn;
sudo ln -s /etc/nginx/sites-available/thuy_english /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Khi có buổi mới: `cd /var/www/thuy_english && sudo git pull` (không cần khởi động lại nginx).

### Bắt buộc có HTTPS để ghi âm

Trình duyệt **chỉ cho dùng micro trên trang https://** (hoặc khi mở file trên máy). Mở bằng `http://` thì mọi phần khác vẫn chạy, riêng nút Ghi âm sẽ báo cần HTTPS.

Với nginx, cách nhanh nhất là Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ten-mien-cua-ban.com
```

Với Docker, đặt container sau một reverse proxy có HTTPS (Caddy, nginx + Certbot, Cloudflare Tunnel…), trỏ về cổng 8080.

## Lưu ý về tiến độ học

- Tiến độ (thẻ, điểm, câu sai) lưu **trong trình duyệt** của từng máy, theo từng địa chỉ trang. Mở trên server sẽ là sổ trống, khác với khi mở file trên máy.
- Muốn chuyển tiến độ: ở trang chủ, mục **Sao lưu tiến độ**, bấm **Xuất file sao lưu** trên máy cũ, rồi **Nhập file sao lưu** trên trang server.
- Bản ghi âm chỉ lưu trên máy đã ghi; muốn giữ thì bấm **⬇ Tải** từng bản.

## Bản quyền

File nghe và lời thoại lấy từ giáo trình, chỉ dùng cho việc học cá nhân.
