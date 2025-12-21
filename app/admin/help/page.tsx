import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `ヘルプ | ${appName}`,
    description: "アプリの設定方法と使い方",
  };
}

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">ヘルプ</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>アプリの概要</CardTitle>
          <CardDescription>
            このアプリケーションは、カスタマイズ可能なアンケートシステムです。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">主な機能</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>管理画面からアンケートの作成・編集・削除</li>
              <li>
                複数の質問タイプに対応（テキスト、メール、ラジオ、チェックボックス、プルダウン）
              </li>
              <li>アンケート結果の集計と確認</li>
              <li>テーマカラーや画像によるカスタマイズ</li>
              <li>アプリ単位での管理（複数アプリの運用が可能）</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>環境変数の設定</CardTitle>
          <CardDescription>
            アプリを動作させるために必要な環境変数を設定します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">.env.local ファイルの作成</h3>
            <p className="text-sm text-muted-foreground mb-2">
              プロジェクトのルートディレクトリに{" "}
              <code className="bg-muted px-1 py-0.5 rounded">.env.local</code>{" "}
              ファイルを作成し、以下の環境変数を設定してください。
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">
                    # アプリ名（管理画面やフッターに表示されます）
                  </span>
                  <br />
                  <span className="text-foreground">
                    NEXT_PUBLIC_APP_NAME=アンケートアプリ
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-muted-foreground">
                    # データベースURL（SQLiteの場合）
                  </span>
                  <br />
                  <span className="text-foreground">
                    DATABASE_URL=&quot;file:./dev.db&quot;
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">環境変数の説明</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  NEXT_PUBLIC_APP_NAME
                </strong>
                :
                アプリケーション全体で使用されるアプリ名。未設定の場合は「アンケートアプリ」がデフォルト値として使用されます。
              </li>
              <li>
                <strong className="text-foreground">DATABASE_URL</strong>:
                Prismaが使用するデータベース接続URL。SQLiteを使用する場合は{" "}
                <code className="bg-muted px-1 py-0.5 rounded">
                  file:./dev.db
                </code>{" "}
                を指定します。
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>データベースのセットアップ</CardTitle>
          <CardDescription>SQLiteデータベースを初期化します。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">マイグレーションの実行</h3>
            <p className="text-sm text-muted-foreground mb-2">
              以下のコマンドを実行してデータベースを初期化します。
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <code>npx prisma migrate dev --name init</code>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              このコマンドにより、
              <code className="bg-muted px-1 py-0.5 rounded">
                prisma/migrations
              </code>{" "}
              ディレクトリ内のマイグレーションファイルが実行され、データベースが作成されます。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>開発サーバーの起動</CardTitle>
          <CardDescription>
            アプリケーションをローカルで実行します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">依存関係のインストール</h3>
            <p className="text-sm text-muted-foreground mb-2">
              初回のみ、以下のコマンドで依存関係をインストールします。
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <code>npm install</code>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">開発サーバーの起動</h3>
            <p className="text-sm text-muted-foreground mb-2">
              以下のコマンドで開発サーバーを起動します。
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <code>npm run dev</code>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              起動後、ブラウザで{" "}
              <a
                href="http://localhost:3000"
                className="text-primary underline"
              >
                http://localhost:3000
              </a>{" "}
              にアクセスしてください。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
          <CardDescription>
            アプリケーションの基本的な操作手順です。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. アプリの作成</h3>
            <p className="text-sm text-muted-foreground mb-2">
              まず、アプリを作成します。サイドバーの「アプリ管理」→「アプリ作成」から新しいアプリを作成できます。
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>アプリ名とスラッグ（URLの一部）を設定</li>
              <li>プライバシーポリシーURLやお問い合わせ先を設定（任意）</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. アンケートの作成</h3>
            <p className="text-sm text-muted-foreground mb-2">
              「アンケート管理」→「新規作成」からアンケートを作成します。
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>タイトル、スラッグ、開催期間を設定</li>
              <li>テーマカラーや画像を設定してデザインをカスタマイズ</li>
              <li>説明文や注意事項を追加</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. 質問の追加</h3>
            <p className="text-sm text-muted-foreground mb-2">
              作成したアンケートの「質問」タブから質問項目を追加します。
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>
                質問タイプを選択（テキスト、メール、ラジオ、チェックボックス、プルダウン）
              </li>
              <li>質問文を入力</li>
              <li>必須項目や最大文字数などのバリデーションを設定</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">4. アンケートの公開</h3>
            <p className="text-sm text-muted-foreground mb-2">
              アンケートは設定したスラッグで自動的に公開されます。
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>
                URL形式:{" "}
                <code className="bg-muted px-1 py-0.5 rounded">
                  http://localhost:3000/[スラッグ]?auser_id=USER_ID
                </code>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">auser_id</code>{" "}
                パラメータは必須です
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">5. 結果の確認</h3>
            <p className="text-sm text-muted-foreground mb-2">
              アンケートの「結果」タブから回答結果を確認できます。
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>各質問の回答をグラフとテキスト一覧で確認</li>
              <li>回答ユーザーIDごとの回答も確認可能</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>その他のコマンド</CardTitle>
          <CardDescription>開発時に便利なコマンド一覧です。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                npm run build
              </code>
              <span className="text-sm text-muted-foreground ml-2">
                本番用にビルド
              </span>
            </div>
            <div>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                npm run start
              </code>
              <span className="text-sm text-muted-foreground ml-2">
                本番モードで起動
              </span>
            </div>
            <div>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                npm run lint
              </code>
              <span className="text-sm text-muted-foreground ml-2">
                コードのリントチェック
              </span>
            </div>
            <div>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                npm run lint:fix
              </code>
              <span className="text-sm text-muted-foreground ml-2">
                リントエラーを自動修正
              </span>
            </div>
            <div>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                npm run format
              </code>
              <span className="text-sm text-muted-foreground ml-2">
                コードのフォーマット
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
