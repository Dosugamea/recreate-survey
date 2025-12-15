# Survey Application (Next.js)

`create-next-app` をベースに構築された、カスタマイズ可能なアンケートシステムです。
管理画面からアンケートを作成・編集し、独自の URL でユーザーに公開することができます。

## ✨ 主な機能

### 管理画面 (Admin Dashboard)

- **ダッシュボード**: 作成済みのアンケート一覧、回答数、ステータス（期間内かどうか）を確認できます。
- **アンケート作成**: タイトル、スラッグ（URL）、開催期間、テーマカラー、ヘッダー/背景画像を設定できます。
- **質問エディタ**: 直感的な UI で質問を追加・編集・削除できます。
  - 対応タイプ: 短文テキスト、メールアドレス、ラジオボタン、チェックボックス、プルダウン
  - バリデーション設定: 必須項目、最大文字数など
- **結果確認**: 集計結果をグラフ（バー表示）とテキスト一覧で確認できます。

### 公開アンケートページ (Public Survey)

- **動的ルーティング**: 設定したスラッグ（例: `/campaign-2025`）でアクセス可能です。
- **デザイン適用**: 管理画面で設定したテーマカラーや画像が自動的に適用されます。
- **ユーザー識別**: URL パラメータ `?auser_id=USER_ID` を使用して、回答ユーザーを識別・記録します。
- **バリデーション**: 入力漏れや形式エラー（メールアドレスなど）を即座に判定します。

## 🛠️ 技術スタック

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via [Prisma](https://www.prisma.io/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Form Handling**: React Hook Form + Zod

## 🚀 始め方 (Getting Started)

### 1. 依存関係のインストール

```bash
cd survey-app
npm install
```

### 2. データベースのセットアップ

SQLite データベースを初期化します。

```bash
npx prisma migrate dev --name init
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

## 📖 使い方

### 管理者として使う

1. [http://localhost:3000/admin](http://localhost:3000/admin) にアクセスします。
2. 「Create Survey」ボタンから新しいアンケートを作成します。
3. 作成後、「Edit」ボタンから質問項目を追加します。

### アンケートに回答する

1. 作成したアンケートの URL にアクセスします。
   - 例: `http://localhost:3000/my-survey?auser_id=TEST001`
   - **注意**: `auser_id` パラメータが必須です。これがないとエラー画面が表示されます（ゲームアプリ等からの遷移を想定しているため）。
2. フォームに入力して送信します。

## 📁 ディレクトリ構成

- `app/admin`: 管理画面のページコンポーネント
- `app/[slug]`: 公開アンケートページの動的ルート
- `app/actions`: Server Actions (DB 操作などのバックエンドロジック)
- `components/admin`: 管理画面用の UI コンポーネント
- `components/survey`: 公開ページ用の UI コンポーネント
- `prisma/schema.prisma`: データベース定義

---

Created with ❤️ by Antigravity
