/**
 * CSV形式の値をエスケープする
 *
 * セキュリティ上の理由から、Excelなどで数式として解釈される可能性のある文字で始まる値は
 * 先頭にシングルクォートを付与して文字列として強制的に扱わせます。
 *
 * 対策対象の文字: =, +, -, @, Tab, Carriage Return
 */
export function escapeCsvValue(value: string): string {
  // CSV Injection対策: 特定の文字で始まる場合は先頭にシングルクォートを付与
  if (/^[=+\-@\t\r]/.test(value)) {
    value = "'" + value;
  }

  // カンマ、改行、ダブルクォートを含む場合はダブルクォートで囲む
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    // ダブルクォート自体は2つ重ねる
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
