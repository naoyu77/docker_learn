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

## 依存関係のキャッシュ活用

```dockerfile
# 依存関係を先にコピー
COPY package*.json ./
RUN npm install

# ソースコードは後でコピー
COPY index.js ./
```

→ `package.json` が変わらなければ `npm install` がキャッシュされ、ビルドが速くなる

## .dockerignore と .gitignore の違い

| ファイル | 用途 |
|----------|------|
| `.gitignore` | **Git** で無視するファイル |
| `.dockerignore` | **docker build** で無視するファイル |

両方に似た内容を書くことが多いが、目的が違う。

### .dockerignore の例

```
node_modules
npm-debug.log
```

→ `docker build` 時にコンテナにコピーされない

## 便利なコマンド

```bash
# 実行中の全コンテナを停止
docker stop $(docker ps -q)

# 停止中の全コンテナを削除
docker rm $(docker ps -aq)
```

`$(...)` はシェルのコマンド置換。コンテナがない場合はエラーになる。

## Express で HTML と API を同時に配信

```javascript
// 静的ファイル配信
app.use(express.static('public'));

// API
app.get('/todos', ...);
```

1つのサーバー（同じポート）でHTMLとAPIの両方を提供できる。

```
ブラウザ → :3000 → Express
                    ├── /         → index.html
                    └── /todos    → API (JSON)
```

## Tips

- `WORKDIR /app` はディレクトリがなければ自動で作成される
- `mkdir -p` の `-p` は parents の略（親ディレクトリも作成）
- コンテナ内のパス（例: `/usr/share/nginx/html/`）はコンテナ内部のファイルシステム
