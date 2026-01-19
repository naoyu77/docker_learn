# ベースイメージを指定
FROM nginx:latest

# HTMLファイルをコンテナにコピー
COPY html/index.html /usr/share/nginx/html/index.html
