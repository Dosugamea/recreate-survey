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

`.env.local` ってファイルを作って、これ貼っつけてね！📝

```bash
# Cloudflare Turnstile（スパム対策用だよ！）
# Cloudflareダッシュボードでサイト追加してキーGETしてね
# https://dash.cloudflare.com/?to=/:account/turnstile
NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY=your-site-key-here
CF_TURNSTILE_SECRET_KEY=your-secret-key-here
```

### 3. データベースの準備 (DB Setup)

Prisma でサクッとテーブル作成！🧙‍♀️

```bash
npx prisma migrate dev --name init
```

### 4. 起動！ (Run)

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてみて！感動するよ🥺✨

---

## 📖 使い方 (How to Use)

### 管理者になりたい！👑

1. [http://localhost:3000/admin](http://localhost:3000/admin) にアクセス！
2. 「Create App」でアプリを作ってから、その中に「Create Survey」でアンケートを作ってね！

- Slugの設定がURLになるから大事だよ！

3. 質問をポチポチ追加していけば完成！簡単でしょ？😉

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
