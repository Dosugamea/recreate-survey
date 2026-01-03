import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

const meta: Meta<typeof PageHeader> = {
  title: "Admin/Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "アンケート一覧",
  },
};

export const WithBackButton: Story = {
  args: {
    title: "アンケート情報編集: 顧客満足度調査",
    backHref: "/admin/surveys",
  },
};

export const WithDescription: Story = {
  args: {
    title: "新しいアンケートを作成",
    backHref: "/admin/surveys",
    description:
      "詳細を入力して新しいアンケートキャンペーンを開始してください。",
  },
};

export const WithAction: Story = {
  args: {
    title: "アンケート一覧",
    description:
      "作成したアンケートの一覧を表示しています。詳細の確認や編集ができます。",
    action: (
      <Button asChild>
        <Link href="/admin/surveys/create">
          <PlusCircle className="mr-2 h-4 w-4" /> アンケート作成
        </Link>
      </Button>
    ),
  },
};

export const WithUrl: Story = {
  args: {
    title: "質問項目編集: 顧客満足度調査",
    backHref: "/admin/surveys/123",
    url: "/my-app/survey-2024/form",
  },
};

export const WithUrlAndExternalLink: Story = {
  args: {
    title: "質問項目編集: 顧客満足度調査",
    backHref: "/admin/surveys/123",
    url: "/my-app/survey-2024/form",
    externalLinkHref: "/my-app/survey-2024/form?auser_id=dummy",
    externalLinkTitle: "アンケートを開く",
  },
};

export const FullExample: Story = {
  args: {
    title: "アンケート情報編集: 2024年度 第1四半期 顧客満足度調査",
    backHref: "/admin/surveys",
    description: "総回答数: 42",
    url: "/my-app/enq-2024-Q1/form",
    externalLinkHref: "/my-app/enq-2024-Q1/form?auser_id=dummy",
    externalLinkTitle: "プレビューを表示",
  },
};
