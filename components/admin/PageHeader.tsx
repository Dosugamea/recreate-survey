import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ページヘッダーのプロパティ
 */
interface PageHeaderProps {
  /**
   * ページタイトル
   * ヘッダーのメインタイトルとして表示されます。
   * @example "アンケート情報編集: 顧客満足度調査"
   * @example "新しいアプリを作成"
   */
  title: string;

  /**
   * 戻るボタンのリンク先URL
   * 親ページや一覧ページへのパスを指定します。
   * @example "/admin/surveys"
   * @example "/admin/apps"
   * @example "/admin/surveys/123"
   */
  backHref: string;

  /**
   * ページの説明文（オプション）
   * タイトルの下に表示される補足説明です。
   * 長文の場合は適切に改行されるため、簡潔に記述してください。
   * @example "アプリの基本情報を入力して新しいアプリを作成してください。"
   * @example "総回答数: 42"
   */
  description?: string;

  /**
   * 表示するURL（オプション）
   * スラッグURLやフォームURLなどを表示する際に使用します。
   * URLが指定されると、その下にコードブロック形式で表示されます。
   * @example "/my-app/survey-2024/form"
   * @example "/admin/surveys/123/questions"
   * @note `externalLinkHref` と組み合わせて使用することを推奨します。
   */
  url?: string;

  /**
   * 外部リンクボタンのURL（オプション）
   * URLが指定されている場合、外部リンクアイコンボタンが表示されます。
   * このリンクは新しいタブで開かれます（target="_blank"）。
   * @example "/my-app/survey-2024/form?auser_id=dummy"
   * @note `url` プロパティと組み合わせて使用することを推奨します。
   * @note `url` が指定されていない場合、このプロパティは無視されます。
   */
  externalLinkHref?: string;

  /**
   * 外部リンクボタンのツールチップテキスト（オプション）
   * 外部リンクボタンにホバーした際に表示されるツールチップです。
   * 指定されない場合は "ページを開く" がデフォルトとして使用されます。
   * @example "アンケートを開く"
   * @example "プレビューを表示"
   * @default "ページを開く"
   */
  externalLinkTitle?: string;
}

/**
 * 管理画面のページヘッダーコンポーネント
 *
 * 各ページの上部に表示される統一されたヘッダーです。
 * 左側に戻るボタン、右側にページタイトルとオプション情報を表示します。
 *
 * @example
 * // 基本的な使用例（タイトルと戻るボタンのみ）
 * <PageHeader
 *   title="アプリ情報を編集"
 *   backHref="/admin/apps"
 * />
 *
 * @example
 * // 説明文付きのヘッダー
 * <PageHeader
 *   title="新しいアンケートを作成"
 *   backHref="/admin/surveys"
 *   description="詳細を入力して新しいアンケートキャンペーンを開始してください。"
 * />
 *
 * @example
 * // URL表示と外部リンク付きのヘッダー
 * <PageHeader
 *   title={`質問項目編集: ${survey.title}`}
 *   backHref={`/admin/surveys/${survey.id}`}
 *   url={`/${survey.app.slug}/${survey.slug}/form`}
 *   externalLinkHref={`/${survey.app.slug}/${survey.slug}/form?auser_id=dummy`}
 *   externalLinkTitle="アンケートを開く"
 * />
 *
 * @param props - PageHeaderProps
 * @returns ページヘッダー要素
 */
export function PageHeader({
  title,
  backHref,
  description,
  url,
  externalLinkHref,
  externalLinkTitle,
}: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href={backHref}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="flex-1">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {url && (
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <span>URL:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {url}
            </code>
            {externalLinkHref && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                asChild
                title={externalLinkTitle || "ページを開く"}
              >
                <Link href={externalLinkHref} target="_blank">
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
