FROM node:20-alpine

WORKDIR /app

# 依存関係を先にコピー（キャッシュ活用）
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY index.js ./
COPY public ./public

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
