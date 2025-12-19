"use client";

import { Button } from "@/components/ui/button";

interface ConfirmationButtonProps {
  /** ボタンがクリックされたときに呼ばれるコールバック関数 */
  onClick: () => void;
  /** ボタンを無効化するかどうか。trueの場合、ボタンはクリック不可になる */
  disabled: boolean;
  /** テーマカラー（16進数形式、例: "#6c4034"）。ボタンの背景色に使用 */
  themeColor: string;
}

export function ConfirmationButton({
  onClick,
  disabled,
  themeColor,
}: ConfirmationButtonProps) {
  return (
    <div className="text-center mt-8">
      <Button
        type="button"
        variant="auto"
        className="w-full sm:w-auto px-12 py-6 text-lg font-bold text-white shadow-md hover:opacity-90 transition-opacity rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: themeColor }}
        onClick={onClick}
        disabled={disabled}
      >
        確認ページへ進む
      </Button>
    </div>
  );
}
