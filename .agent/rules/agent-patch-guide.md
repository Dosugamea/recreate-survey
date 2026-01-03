---
trigger: always_on
---

## 変更検証ステップ

変更を行った場合は、下記のコマンドを実行してエラーがないことを確認してください。エラーがある場合は変更を行い、再度繰り返してください。

### 変更検証コマンド

- 1 型チェック
  - `npm run type-check`
- 2 Lintチェック
  - `npm run lint`
- 3 テストコード実行
  - `npm run test`
- 4 ビルド実行
  - `npm run build`
