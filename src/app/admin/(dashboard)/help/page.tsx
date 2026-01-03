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
            本アプリケーションは、用途に合わせたアンケートを簡単に作成・公開できるシステムです。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">主な特徴</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                <strong>アプリ管理</strong>:
                複数のアンケートを「アプリ」という単位でグループ化し、一括管理できます。
              </li>
              <li>
                <strong>柔軟なデザイン設定</strong>:
                テーマカラーやヘッダー画像を設定し、ブランドに合わせたアンケートページを作成可能です。
              </li>
              <li>
                <strong>外部連携（Webhook）</strong>:
                回答があった際に、DiscordやSlackなどの外部ツールへ即座に通知を送信できます。
              </li>
              <li>
                <strong>回答の自動集計</strong>:
                収集した回答はリアルタイムでグラフ化され、管理画面からすぐに確認・分析が可能です。
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ご利用の流れ</CardTitle>
          <CardDescription>
            アンケートを作成して公開するまでの基本的な手順をご案内します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-primary">
              1. アプリを作成する
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              「アプリ管理」メニューから新しいアプリを作成します。アプリごとにプライバシーポリシーやお問い合わせ先のURLを設定することが可能です。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary">
              2. アンケートを作成する
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              作成したアプリ内で、個別のアンケートを作成します。「スラッグ」は公開時のURLの一部として使用されます。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary">3. 質問の追加</h3>
            <p className="text-sm text-muted-foreground mb-2">
              「質問」タブから、ラジオボタン、チェックボックス、テキストなどの形式で質問を作成します。必須入力や文字数制限などのバリデーションも設定可能です。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary">
              4. デザインのカスタマイズ
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              「デザイン」設定から、テーマカラーやヘッダー画像などを設定し、アンケートページの見た目を調整します。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>公開と配布方法</CardTitle>
          <CardDescription>
            作成したアンケートを対象者に共有する方法について説明します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            アンケートの公開URLは以下の形式になります：
            <br />
            <code className="bg-muted px-1 py-0.5 rounded text-foreground">
              /[アプリSlug]/[アンケートSlug]/form
            </code>
          </p>
          <div className="bg-destructive/10 p-4 border border-destructive/20 rounded-lg">
            <h4 className="font-bold text-destructive mb-1">
              重要：ユーザー識別パラメータ（auser_id）について
            </h4>
            <p>
              本システムでは回答者を識別するため、URLパラメータ{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-foreground">
                ?auser_id=ユーザーID
              </code>{" "}
              が必須となっています。
            </p>
            <p className="mt-2 text-xs text-destructive">
              ※このパラメータが付与されていない場合、エラーが表示され回答することができません。配布時には必ず適切なIDが含まれていることをご確認ください。
            </p>
          </div>
          <p>
            Webhook設定を有効にすることで、回答受付のタイミングで外部システムへ通知を行う運用が可能です。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>回答結果の確認</CardTitle>
          <CardDescription>
            集まった回答を確認・分析する方法について説明します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            アンケート詳細画面の「結果」タブから、以下の情報を確認できます。
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>質問ごとの回答分布（グラフ表示）</li>
            <li>回答者ごとの具体的な回答内容一覧</li>
            <li>回答日時やユーザーIDごとの回答履歴</li>
          </ul>
          <p>
            収集されたデータに基づき、傾向の把握や改善に役立てることができます。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
