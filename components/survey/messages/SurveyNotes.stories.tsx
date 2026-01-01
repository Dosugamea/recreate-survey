import type { Meta, StoryObj } from "@storybook/react";
import { SurveyNotes } from "@/components/survey/messages/SurveyNotes";

const meta: Meta<typeof SurveyNotes> = {
  title: "Survey/SurveyNotes",
  component: SurveyNotes,
  tags: ["autodocs"],
  argTypes: {
    survey: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof SurveyNotes>;

const baseSurvey = {
  id: "survey-1",
  slug: "test-survey",
  title: "顧客満足度調査",
  description: "いつもご利用ありがとうございます。",
  startAt: new Date("2024-01-01"),
  endAt: new Date("2024-12-31"),
  themeColor: "#6c4034",
  headerImage: null,
  bgImage: null,
  notes: "回答いただいた内容は、今後のサービス改善に活用させていただきます。",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: "app-1",
  webhookUrl: null,
};

export const Default: Story = {
  args: {
    survey: baseSurvey,
  },
};

export const WithLongNotes: Story = {
  args: {
    survey: {
      ...baseSurvey,
      notes: `回答いただいた内容は、今後のサービス改善に活用させていただきます。

【注意事項】
・回答は一度送信すると変更できません
・回答には個人情報が含まれる場合があります
・回答内容は統計的に処理され、個人を特定できる情報は公開されません
・回答期間は2024年12月31日までです`,
    },
  },
};

export const WithoutNotes: Story = {
  args: {
    survey: {
      ...baseSurvey,
      notes: null,
    },
  },
};

export const BlueTheme: Story = {
  args: {
    survey: {
      ...baseSurvey,
      themeColor: "#2563eb",
    },
  },
};

export const GreenTheme: Story = {
  args: {
    survey: {
      ...baseSurvey,
      themeColor: "#10b981",
    },
  },
};
