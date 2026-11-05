# Sổ học tiếng Anh: trang tĩnh chạy bằng nginx.
#   docker build -t so-hoc-tieng-anh .
#   docker run -d --name so-hoc -p 8080:80 --restart unless-stopped so-hoc-tieng-anh
FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html Nghe_1.14-1.15.html /usr/share/nginx/html/
COPY So_hoc_tieng_Anh /usr/share/nginx/html/So_hoc_tieng_Anh

EXPOSE 80
