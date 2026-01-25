# デプロイガイド (Vercel & Supabase)

このガイドでは、Supabase をデータベースプロバイダーとして使用し、アンケートアプリを Vercel にデプロイする方法を説明するよ！✨

## 事前準備

- [Vercel アカウント](https://vercel.com/)
- [Supabase アカウント](https://supabase.com/)
- ローカル環境に Node.js と npm がインストールされていること

## 1. Supabase のセットアップ

1. [Supabase ダッシュボード](https://supabase.com/dashboard)で新しいプロジェクトを作成してね。
2. **Project Settings** -> **Database** に移動。
3. **Connection String** (Transaction Mode) をコピー。これが `DATABASE_URL` になるよ。
   - `[YOUR-PASSWORD]` の部分は、自分で設定したデータベースパスワードに書き換えてね。
   - 例: `postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
4. 同様に、**Connection String** (Session Mode) または "Direct Connection" をコピー。これが `DIRECT_URL` になるよ。
   - 例: `postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`

## 2. 環境変数の設定

以下の環境変数を設定する必要があるよ。

### ローカル開発 (`.env`)

ローカルの `.env` ファイルを Supabase の接続文字列に更新して、リモートデータベースでテストできるようにしよう（任意）。

```env
DATABASE_URL="あなたのトランザクション接続文字列"
DIRECT_URL="あなたのセッション接続文字列"
NEXTAUTH_SECRET="生成したシークレット"
NEXTAUTH_URL="http://localhost:3000"
```

> **注意**: `prisma generate`（開発時やビルド時に使用）およびアプリのビルドプロセスでは、環境変数に `DATABASE_URL` が存在している必要があるよ。`Missing required environment variable: DATABASE_URL` というエラーが出た場合は、`.env` に設定されているか確認してね（ビルドを通すだけなら、有効な形式のダミー URL でも大丈夫だよ）。

### Vercel のプロジェクト設定

Vercel のプロジェクト設定 -> **Settings** -> **Environment Variables** で以下を追加してね：

- `DATABASE_URL`: (Supabase の Transaction 接続文字列)
- `DIRECT_URL`: (Supabase の Session 接続文字列)
- `NEXTAUTH_SECRET`: `openssl rand -base64 32` などで生成した文字列
- `NEXTAUTH_URL`: デプロイ先のドメイン (例: `https://your-app.vercel.app`)

## 3. データベースのマイグレーション

SQLite から PostgreSQL に切り替えたから、新しい Supabase データベースにスキーマを適用する必要があるよ。

ローカル環境で以下のコマンドを実行してね（`.env` に正しい Supabase URL が設定されていることを確認してね）：

```bash
npx prisma migrate deploy
```

> **Note**: これで Supabase プロジェクト内にテーブルが作成されるよ！

## 4. Vercel へのデプロイ

### 4-1. GitHub へコードをプッシュ

まだ GitHub にコードを上げていない場合は、リポジトリを作成してプッシュしよう。

```bash
# git の初期化（まだの場合）
git init

# 全ファイルをステージング
git add .

# コミット
git commit -m "Initial commit for Vercel deployment"

# GitHub で作成したリポジトリのリモートURLを登録（URLは自分のものに変えてね）
git remote add origin https://github.com/YourUsername/your-repo-name.git

# プッシュ
git push -u origin main
```

### 4-2. Vercel でプロジェクトを作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス。
2. 右上の **"Add New..."** ボタンをクリックし、**"Project"** を選択。
3. **"Import Git Repository"** の画面が表示されるので、さっきプッシュしたリポジトリの横にある **"Import"** ボタンをクリック。

### 4-3. プロジェクトの設定 (Configure Project)

設定画面が表示されるので、以下の項目を確認・入力してね。

- **Project Name**: そのままでOK（好きな名前に変えてもOK）。
- **Framework Preset**: `Next.js` になっていることを確認。
- **Root Directory**: `.` (ルート) のままでOK。
- **Build and Output Settings**: 基本的にデフォルトのままでOK。
  - `Build Command`: `next build`
  - `Install Command`: `npm install` (など)
  - ※ `package.json` に `postinstall: "prisma generate"` を追加しておいたから、インストール時に勝手に Prisma Client も生成されるはずだよ！

### 4-4. 環境変数の設定 (Environment Variables)

ここが一番大事！ **Environment Variables** という項目を展開して、以下の変数を一つずつ追加してね。

| Key               | Value                                                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`    | Supabase の **Connection Pooling (Transaction Mode)** の接続文字列。**重要: ポートが 6543 のものを使ってね！** (これを使わないと Vercel から繋がりません) |
| `DIRECT_URL`      | Supabase の **Session Mode** (ポート 5432) の接続文字列                                                                                                   |
| `NEXTAUTH_SECRET` | 認証用のランダムな文字列                                                                                                                                  |
| `NEXTAUTH_URL`    | デプロイ後のURL (例: `https://プロジェクト名.vercel.app`)                                                                                                 |

> **重要**: エラー `P1001: Can't reach database server` が出る場合は、Vercel が Supabase の IPv6 アドレスに接続できていないのが原因だよ。
> 必ず Supabase ダッシュボードの `Settings` -> `Database` -> `Connection pooling` にある URL (ドメインが `pooler.supabase.com` になってるやつ) を使ってね！

### 4-5. デプロイ実行！

設定が終わったら、下の **"Deploy"** ボタンをクリック！
ビルドログが流れて、しばらく待つと... **"Congratulations!"** という画面が出れば成功だよ！🎉

失敗しちゃった場合は "Logs" タブを見てエラー内容を確認してみてね。よくあるのは環境変数の設定ミス（コピペミス）だよ。

## トラブルシューティング

- **Prisma Client Error**: "Prisma Client not initialized" というエラーが出る場合は、ビルド中に `prisma generate` が実行されているか確認してね（通常、Vercel では自動的に実行されるよ）。
- **コネクションプーリング**: サーバーレス環境（Vercel）での接続数制限を効率的に扱うために、アプリからは `DATABASE_URL` (プーリングあり) を使い、マイグレーション等には `DIRECT_URL` を使う構成にしてるよ。
