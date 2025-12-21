import { hexToRgba } from "@/lib/utils";

interface SurveyDescriptionProps {
  /** アンケートの説明文。改行はそのまま反映される */
  description?: string | null;
  /** テーマカラー（16進数形式、例: "#6c4034"）。セクションの背景色に使用 */
  themeColor: string;
  /** 期間に関するメッセージ。開始前・実施中・終了後のいずれかの状態に応じたメッセージ。期間が設定されていない場合はnull */
  periodMessage: string | null;
}

/**
 * アンケートの説明文と期間情報を表示するコンポーネント
 */
export function SurveyDescription({
  description,
  themeColor,
  periodMessage,
}: SurveyDescriptionProps) {
  const accentBg = hexToRgba(themeColor, 0.5);
  const lightAccentBg = hexToRgba(themeColor, 0.2);

  return (
    <section id="information">
      <h3
        className="flex flex-col sm:flex-row text-white text-sm sm:text-base font-bold"
        style={{ backgroundColor: accentBg }}
      >
        <span className="flex-1 py-5 px-6 text-2xl">キャンペーン情報</span>
        {periodMessage && (
          <span
            className="flex-1 text-center text-sm rounded my-auto py-3 h-full mx-6"
            style={{ backgroundColor: lightAccentBg }}
          >
            {periodMessage}
          </span>
        )}
      </h3>
      {description && (
        <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap">
          {description}
        </div>
      )}
    </section>
  );
}
