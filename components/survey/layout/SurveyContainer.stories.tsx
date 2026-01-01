import type { Meta, StoryObj } from "@storybook/react";
import { SurveyContainer } from "@/components/survey/layout/SurveyContainer";

const meta: Meta<typeof SurveyContainer> = {
  title: "Survey/SurveyContainer",
  component: SurveyContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SurveyContainer>;

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
  notes: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: "app-1",
  webhookUrl: null,
};

export const Default: Story = {
  args: {
    survey: baseSurvey,
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">コンテンツエリア</h1>
        <p>このコンテナ内にアンケートのコンテンツが表示されます。</p>
      </div>
    ),
  },
};

export const WithBackgroundImage: Story = {
  args: {
    survey: {
      ...baseSurvey,
      bgImage: "https://placehold.co/1920x1080/6c4034/ffffff?text=Background",
    },
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">コンテンツエリア</h1>
        <p>背景画像が設定されたコンテナです。</p>
      </div>
    ),
  },
};

export const BlueTheme: Story = {
  args: {
    survey: {
      ...baseSurvey,
      themeColor: "#2563eb",
    },
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">コンテンツエリア</h1>
        <p>ブルーテーマのコンテナです。</p>
      </div>
    ),
  },
};

export const GreenTheme: Story = {
  args: {
    survey: {
      ...baseSurvey,
      themeColor: "#10b981",
    },
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">コンテンツエリア</h1>
        <p>グリーンテーマのコンテナです。</p>
      </div>
    ),
  },
};
