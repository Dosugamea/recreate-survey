interface SurveyWarnProps {
  /** 警告メッセージを表示するかどうか。trueの場合、アプリ内からのアクセスが必要である旨の警告を表示 */
  show: boolean;
}

/**
 * アンケートの警告メッセージコンポーネント
 * userIdがない場合に表示される警告
 */
export function SurveyWarn({ show }: SurveyWarnProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
      <p className="text-sm text-yellow-700">
        キャンペーンに参加するためにはアプリ内からアクセスいただく必要があります。
      </p>
    </div>
  );
}
