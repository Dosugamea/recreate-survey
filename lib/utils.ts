import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 16進数形式の色コードをRGBA形式の文字列に変換する
 *
 * @param hex - 変換する16進数形式の色コード。3桁（#RGB）または6桁（#RRGGBB）の形式を想定
 * @param alpha - アルファ値（透明度）。0.0（完全透明）から1.0（完全不透明）の範囲
 * @returns RGBA形式の文字列（例: "rgba(255, 0, 0, 0.5)"）
 *
 * @example
 * ```typescript
 * hexToRgba("#f00", 0.5)     // "rgba(255, 0, 0, 0.5)"
 * hexToRgba("#ff0000", 0.5)  // "rgba(255, 0, 0, 0.5)"
 * hexToRgba("#invalid", 0.5) // "rgba(0, 0, 0, 0.5)" （無効な場合は黒色）
 * ```
 */
export function hexToRgba(hex: string, alpha: number) {
  // hexの長さに応じてRGB値をパース
  const { r, g, b } = (() => {
    switch (hex.length) {
      case 4: // 3桁の短縮形（#RGB）→各桁を2回繰り返して6桁に展開
        return {
          r: parseInt(hex[1] + hex[1], 16),
          g: parseInt(hex[2] + hex[2], 16),
          b: parseInt(hex[3] + hex[3], 16),
        };
      case 7: // 6桁の標準形（#RRGGBB）→2桁ずつRGB値としてパース
        return {
          r: parseInt(hex.slice(1, 3), 16),
          g: parseInt(hex.slice(3, 5), 16),
          b: parseInt(hex.slice(5, 7), 16),
        };
      default: // 無効な形式の場合は黒色（0, 0, 0）を返す
        return { r: 0, g: 0, b: 0 };
    }
  })();
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
