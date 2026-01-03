import type { Meta, StoryObj } from "@storybook/react";
import { SurveyPreview } from "@/features/admin/surveys/components/SurveyPreview";
import type { SurveySchema } from "@/lib/schemas";

const meta: Meta<typeof SurveyPreview> = {
  title: "Admin/Survey/SurveyPreview",
  component: SurveyPreview,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SurveyPreview>;

const mockFormData: SurveySchema = {
  appId: "app-1",
  title: "2024年度 第1四半期 顧客満足度調査",
  slug: "enq-2024-Q1",
  description: "このアンケートにご記入ください。",
  notes: "回答は匿名で処理されます。",
  startAt: new Date("2024-01-01"),
  endAt: new Date("2024-03-31"),
  themeColor: "#6c4034",
  headerImage: "https://placehold.co/800x200/6c4034/ffffff?text=Header+Image",
  bgImage: undefined,
};

export const Default: Story = {
  args: {
    formData: mockFormData,
  },
};

export const WithMinimalData: Story = {
  args: {
    formData: {
      appId: "app-1",
      title: "タイトル未設定",
      slug: "",
      description: "",
      notes: "",
      startAt: new Date("2024-01-01"),
      endAt: new Date("2024-03-31"),
      themeColor: "#6c4034",
    },
  },
};

export const WithBackgroundImage: Story = {
  args: {
    formData: {
      ...mockFormData,
      bgImage: "https://placehold.co/1920x1080/f0f0f0/666666?text=Background",
    },
  },
};

export const WithCustomThemeColor: Story = {
  args: {
    formData: {
      ...mockFormData,
      themeColor: "#2563eb",
    },
  },
};

export const WithLongDescription: Story = {
  args: {
    formData: {
      ...mockFormData,
      description:
        "このアンケートは、2024年度第1四半期における顧客満足度を調査することを目的としています。ご回答いただいた内容は、今後のサービス改善に活用させていただきます。",
      notes:
        "回答は匿名で処理されます。個人情報の取り扱いについては、プライバシーポリシーをご確認ください。",
    },
  },
};
