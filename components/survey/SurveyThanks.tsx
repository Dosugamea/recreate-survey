import { hexToRgba } from "@/lib/utils";

interface SurveyThanksProps {
  /** 送信完了メッセージを表示するかどうか。trueの場合、送信完了の感謝メッセージを表示 */
  show: boolean;
  /** テーマカラー（16進数形式、例: "#6c4034"）。メッセージの背景色に使用 */
  themeColor: string;
  /** アプリ名。感謝メッセージ内で使用。省略時は「アプリ」と表示 */
  appName?: string;
}

/**
 * アンケート送信完了メッセージコンポーネント
 */
export function SurveyThanks({ show, themeColor, appName }: SurveyThanksProps) {
  if (!show) {
    return null;
  }

  const accentBg = hexToRgba(themeColor, 0.5);

  return (
    <section id="completion">
      <h3
        className="flex flex-col sm:flex-row text-white text-sm sm:text-base font-bold"
        style={{ backgroundColor: accentBg }}
      >
        <span className="flex-1 py-5 px-6 text-2xl">
          内容の送信が完了しました
        </span>
      </h3>
      <div className="text-sm leading-relaxed text-center p-4">
        ご参加ありがとうございました。
        <br />
        今後とも『{appName || "アプリ"}』をよろしくお願いいたします。
      </div>
    </section>
  );
}
