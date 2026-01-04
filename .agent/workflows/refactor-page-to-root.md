---
description: page.tsx から XYZPageRoot.tsx へのコンポーネント切り出しワークフロー
---

このワークフローは、App Router の `page.tsx` に記述されている UI ロジックを、各 feature ディレクトリ配下の `PageRoot` コンポーネントに切り出す手順を定義します。これにより、Server Component である `page.tsx` の責務をデータ取得と共通レイアウトへの受け渡しに限定し、UI ロジックをカプセル化します。

## 1. 構成の特定

- 対象の `page.tsx` のパスを確認します。
- 切り出し先の feature ディレクトリを特定します（例: `src/features/admin/users`）。
- 新しく作成するコンポーネント名を以下の規則に従って決定します。
  - **一覧ページ (機能名複数形)**: `[XYZs]ListPageRoot.tsx` (例: `UsersListPageRoot.tsx`)
  - **詳細ページ (機能名単数形)**: `[XYZ]DetailPageRoot.tsx` (例: `UserDetailPageRoot.tsx`)
  - **作成ページ (機能名単数形)**: `[XYZ]CreatePageRoot.tsx` (例: `UserCreatePageRoot.tsx`)
  - **編集ページ (機能名単数形)**: `[XYZ]EditPageRoot.tsx` (例: `UserEditPageRoot.tsx`)
  - ※ `XYZ` は機能名。一覧のみ複数形（sを付ける等）にします。

## 2. PageRoot コンポーネントの作成

特定した feature ディレクトリの `components` フォルダ内に `PageRoot` コンポーネントを作成します。

- **ファイルパス**: `src/features/[feature]/components/[XYZ][Type]PageRoot.tsx`
- **インポート**:
  - 必要に応じて `@/features/admin/layout/components/PageHeader` をインポートします。
  - UI ライブラリ（`@/components/ui/...`）やアイコン（`lucide-react`）を移行します。
- **実装**:
  - 名前付きエクスポート（`export function XYZ[Type]PageRoot(...)`）を基本とします。
  - `page.tsx` から UI 部分（JSX）を移行し、`PageHeader` を使用してタイトルや説明、アクションボタンを設定します。
  - props の型定義には、必要に応じて `@prisma/client` の型を使用します。

## 3. Server Actions の作成 (データ取得・操作)

UI 以外のロジック（DB操作、データ取得）を feature ディレクトリの `actions` フォルダ内に作成または移行します。

- **ファイルパス**: `src/features/[feature]/actions/[feature].ts`
- **実装**:
  - `"use server"` 宣言をファイルの先頭に記述します。
  - `getXYZ`, `createXYZ`, `updateXYZ` などの関数を実装します。
  - 必要に応じて `ensureUser()` による権限チェックや、Prisma による DB 操作を含めます。
  - バリデーションが必要な場合は `safeParse` 等を用いてエラーハンドリングを行います。

## 4. page.tsx のリファクタリング

`page.tsx` を以下の構成に変更します。

- **メタデータ**: `generateMetadata` または `export const metadata` は `page.tsx` に残します。
- **設定**: 必要に応じて `export const dynamic = "force-dynamic";` を記述します。
- **ロジック**: `actions` から関数を呼び出してデータを取得します（例: `const data = await getXYZs()`）。
- **レンダリング**: 戻り値として `PageRoot` コンポーネントのみを呼び出し、取得したデータを props として渡します。

## 5. 変更の検証

// turbo-all
以下のコマンドを実行して、変更に問題がないか確認してください。

1. フォーマット: `npm run format`
1. 型チェック: `npm run type-check`
1. Lintチェック: `npm run lint`
1. テスト実行: `npm run test`

## 6. 実装例 (一覧ページの場合)

### 切り出し先: `src/features/items/components/ItemsListPageRoot.tsx`

```tsx
import { Item } from "@prisma/client";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface ItemsListPageRootProps {
  items: Item[];
}

export function ItemsListPageRoot({ items }: ItemsListPageRootProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="アイテム管理"
        description="アイテム一覧の管理ができます。"
        action={
          <Button asChild>
            <Link href="/admin/items/create">
              <PlusCircle className="mr-2 h-4 w-4" /> アイテム作成
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}
```

### 切り出し後の `page.tsx`

```tsx
import { getAllItems } from "@/features/admin/items/actions/items";
import { ItemsListPageRoot } from "@/features/admin/items/components/ItemsListPageRoot";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "アイテム管理" };
}

export default async function ItemsPage() {
  const items = await getAllItems();
  return <ItemsListPageRoot items={items} />;
}
```
