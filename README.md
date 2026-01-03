# Survey Application (Next.js) 💖

`create-next-app` をベースにした、超カワで高機能なアンケートシステムだよ！🎀
管理画面から「アプリ」と「アンケート」を作って、独自の URL でみんなに答えてもらおー！✨

## ✨ アピールポイント (Features)

### アプリ＆アンケート管理 (Admin Dashboard) 👩‍💻

- **アプリ管理**: アンケートを「アプリ」ごとに束ねられるよ！プライバシーポリシーやお問い合わせURLもアプリ単位で設定できちゃう。
- **ダッシュボード**: 今の回答数とかステータスが一目でわかる！👀
- **アンケート作成**:
  - URL（スラッグ）は自由に決められるよ（例: `/campaign-2025`）🔗
  - テーマカラーやヘッダー画像、背景画像を設定して、世界観を作り込もう！🎨
  - **Webhook対応**: 回答があったらすぐに通知を送れるよ！🚀
- **質問エディタ**:
  - ラジオボタン、チェックボックス、プルダウン、テキストなんでもこい！💪
  - 必須項目とか文字数制限もバッチリ設定できるよ。

### 公開アンケートページ (Public Survey) 📱

- **URL構造**: `/[アプリSlug]/[アンケートSlug]/form` でアクセス！
  - 例: `/my-game/summer-event/form`
- **デザイン適用**: 管理画面で作ったデザインがそのまま反映されるから、独自性バツグン💖
- **ユーザー識別**: URL パラメータ `?auser_id=USER_ID` をつけて、誰が回答したかちゃんと記録するよ！（これ忘れるとエラーだから気をつけてね🥺）
- **即時バリデーション**: 入力ミスはその場でチェック！優しく教えてあげるよ✅

## 🛠️ 使ってる技術 (Tech Stack)

最先端の技術詰め込んだよ！🔥

- **Framework**: [Next.js](https://nextjs.org/) (App Router) - もはや常識だよね！
- **Language**: TypeScript - 型しか勝たん🥺
- **Database**: SQLite (via [Prisma](https://www.prisma.io/)) - 手軽さが神✨
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - スタイリング爆速！
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - オシャレすぎ💕
- **Form Handling**: React Hook Form + Zod - バリデーションも完璧！

## 🚀 始め方 (Getting Started)

まずはここからスタート！やってみよー！✊

### 1. 準備 (Install)

```bash
cd survey-app
npm install
```

### 2. 環境変数の設定 (EnvVars)

`.env.example` をコピーして `.env` ファイルを作ってね！📝

```bash
# Windowsの場合
copy .env.example .env

# Mac/Linuxの場合
cp .env.example .env
```

これでとりあえず動くよ！🎉 必要に応じて以下の値を変更してね：

- **`NEXT_PUBLIC_APP_NAME`**: アプリ全体の名称（ページタイトルや管理画面のヘッダーに表示されるよ！）
- **`AUTH_SECRET`**: 本番環境では必ず変更！`npx auth secret` コマンドで自動生成できるよ
- **`NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY`** / **`CF_TURNSTILE_SECRET_KEY`**: Cloudflare Turnstileの設定

<details>
<summary>📋 環境変数の詳細説明（クリックして展開）</summary>

```bash
# ============================================
# Application Settings
# ============================================
NEXT_PUBLIC_APP_NAME="Survey App"

# ============================================
# Database
# ============================================
DATABASE_URL="file:./dev.db"

# ============================================
# Auth.js (NextAuth v5) - 認証・セッション管理
# ============================================
AUTH_SECRET="development-secret-key-change-in-production-min-32-chars"
AUTH_URL="http://localhost:3000"

# ============================================
# Cloudflare Turnstile (オプション)
# ============================================
NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY=""
CF_TURNSTILE_SECRET_KEY=""
```

</details>

### 3. データベースの準備 (DB Setup)

Prisma でサクッとテーブル作成！🧙‍♀️

```bash
# マイグレーション実行（テーブル作成）
npx prisma migrate dev --name init

# Prisma Clientの生成
npx prisma generate

# 初回管理者ユーザーの作成
npx tsx scripts/seed-admin.ts
```

これで管理者ユーザーが作成されるよ！👑

- **📧 メールアドレス**: `admin@example.com`
- **🔑 パスワード**: `password123`

**注意**: 本番環境では必ずパスワードを変更してね！🔒

### 4. 起動！ (Run)

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてみて！感動するよ🥺✨

---

## 📖 使い方 (How to Use)

### 管理者になりたい！👑

1. [http://localhost:3000/admin/login](http://localhost:3000/admin/login) にアクセス！
2. 初回セットアップで作成した管理者アカウントでログイン：
   - **メールアドレス**: `admin@example.com`
   - **パスワード**: `password123`
3. ログインしたら [http://localhost:3000/admin](http://localhost:3000/admin) のダッシュボードへ！
4. 「Create App」でアプリを作ってから、その中に「Create Survey」でアンケートを作ってね！

- Slugの設定がURLになるから大事だよ！

5. 質問をポチポチ追加していけば完成！簡単でしょ？😉

### アンケートに答えたい！📝

1. 作ったアンケートの URL にアクセス！
   - 構成: `http://localhost:3000/[アプリSlug]/[アンケートSlug]/form`
   - 例: `http://localhost:3000/my-game/summer-event/form?auser_id=TEST001`
   - **重要⚠️**: `auser_id` がないと「誰？🤔」ってなってエラーになるから絶対つけてね！
2. フォームに入力して送信！ありがとう！🙏

## 📁 中身はどうなってるの？ (Structure)

- `app/admin`: 管理画面の秘密基地 🏰
- `app/[app]/[slug]/form`: 実際のアンケートページはココ！🌟
- `app/actions`: 裏側の頑張り屋さんたち (Server Actions) ⚙️
- `components`: Reactコンポーネントの部品箱 📦
- `prisma/schema.prisma`: データの設計図 🗺️

---

Created with ❤️ by Antigravity
