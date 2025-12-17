import { useEffect } from "react";

interface UseScrollToElementProps {
  /** スクロール先の要素のID。document.getElementByIdで取得される */
  elementId: string;
  /** スクロールを実行するかどうか。trueの場合、指定された要素までスクロール */
  shouldScroll: boolean;
  /** スクロールの動作。"auto"（即座に）または"smooth"（スムーズに）。デフォルトは"auto" */
  behavior?: ScrollBehavior;
  /** スクロール後の要素の位置。"start"（要素の先頭）、"center"（中央）、"end"（末尾）など。デフォルトは"start" */
  block?: ScrollLogicalPosition;
}

/**
 * 指定された要素へのスクロール処理を提供するフック
 */
export function useScrollToElement({
  elementId,
  shouldScroll,
  behavior = "auto",
  block = "start",
}: UseScrollToElementProps) {
  useEffect(() => {
    if (!shouldScroll) {
      return;
    }

    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior, block });
    }
  }, [elementId, shouldScroll, behavior, block]);
}
