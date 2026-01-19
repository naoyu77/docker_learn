# Docker学習メモ

## Dockerとは

アプリケーションとその依存関係をコンテナという軽量で移植可能なユニットにパッケージ化するプラットフォーム。

## 基本用語

- **イメージ**: コンテナの設計図
- **コンテナ**: イメージから作成された実行中のインスタンス
- **Docker Hub**: イメージを共有するレジストリ

## 学んだコマンド

### Dockerの確認

```bash
docker --version
```

### コンテナの実行

```bash
docker run hello-world
```

### Nginxの起動

```bash
docker run -d -p 8080:80 nginx
```

| オプション | 説明 |
|-----------|------|
| `-d` | バックグラウンドで実行（デタッチモード） |
| `-p 8080:80` | ホストの8080番ポートをコンテナの80番ポートに接続 |

起動後、http://localhost:8080 でアクセス可能。

## コンテナ・イメージの管理

```bash
# 実行中のコンテナを確認
docker ps

# 停止中も含む全コンテナ
docker ps -a

# 全イメージ
docker images

# コンテナを停止・削除
docker stop <コンテナID>
docker rm <コンテナID>

# イメージを削除
docker rmi <イメージID>

# まとめて掃除
docker system prune -a
```

## Dockerfile

Dockerfileを使って、カスタムイメージを作成できる。

### 基本的な命令

| 命令 | 用途 | 実行タイミング |
|------|------|--------------|
| `FROM` | ベースイメージ指定 | - |
| `WORKDIR` | 作業ディレクトリ設定（なければ作成） | ビルド時 |
| `COPY` | ファイルをコピー | ビルド時 |
| `RUN` | コマンド実行 | ビルド時 |
| `ENV` | 環境変数設定 | ビルド時 |
| `EXPOSE` | ポート公開（ドキュメント） | - |
| `CMD` | 起動コマンド | コンテナ起動時 |

### 例：カスタムNginx

```dockerfile
FROM nginx:latest
COPY html/index.html /usr/share/nginx/html/index.html
```

### 例：Node.jsアプリ

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY index.js ./

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
```

### イメージのビルドと実行

```bash
# ビルド
docker build -t my-app .

# 実行
docker run -d -p 3000:3000 my-app
```

## Tips

- `WORKDIR /app` はディレクトリがなければ自動で作成される
- `mkdir -p` の `-p` は parents の略（親ディレクトリも作成）
- コンテナ内のパス（例: `/usr/share/nginx/html/`）はコンテナ内部のファイルシステム
