import type { Meta, StoryObj } from "@storybook/react";
import { SurveyContent } from "./SurveyContent";

const meta: Meta<typeof SurveyContent> = {
  title: "Survey/SurveyContent",
  component: SurveyContent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[640px] mx-auto bg-white shadow-xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SurveyContent>;

const baseSurvey = {
  id: "survey-1",
  slug: "test-survey",
  title: "顧客満足度調査",
  description:
    "いつもご利用ありがとうございます。\n今後のサービス向上のため、アンケートにご協力ください。",
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
};

const baseQuestions = [
  {
    id: "q-1",
    surveyId: "survey-1",
    order: 1,
    type: "TEXT" as const,
    label: "お名前を教えてください",
    required: true,
    maxLength: null,
    options: null,
  },
  {
    id: "q-2",
    surveyId: "survey-1",
    order: 2,
    type: "EMAIL" as const,
    label: "メールアドレス",
    required: true,
    maxLength: null,
    options: null,
  },
  {
    id: "q-3",
    surveyId: "survey-1",
    order: 3,
    type: "RADIO" as const,
    label: "あなたの性別を教えてください",
    required: false,
    maxLength: null,
    options: JSON.stringify(["男性", "女性", "その他"]),
  },
  {
    id: "q-4",
    surveyId: "survey-1",
    order: 4,
    type: "CHECKBOX" as const,
    label: "興味のあるジャンル（複数回答可）",
    required: false,
    maxLength: null,
    options: JSON.stringify([
      "テクノロジー",
      "ビジネス",
      "デザイン",
      "マーケティング",
    ]),
  },
];

export const Default: Story = {
  args: {
    survey: baseSurvey,
    questions: baseQuestions,
    userId: "user-123",
    appName: "テストアプリ",
  },
};

export const BlueTheme: Story = {
  args: {
    survey: {
      ...baseSurvey,
      themeColor: "#2563eb",
    },
    questions: baseQuestions,
    userId: "user-123",
    appName: "テストアプリ",
  },
};

export const GreenTheme: Story = {
  args: {
    survey: {
      ...baseSurvey,
      themeColor: "#10b981",
    },
    questions: baseQuestions,
    userId: "user-123",
    appName: "テストアプリ",
  },
};

export const WithHeaderImage: Story = {
  args: {
    survey: {
      ...baseSurvey,
      headerImage:
        "https://placehold.co/800x200/6c4034/ffffff?text=Header+Image",
    },
    questions: baseQuestions,
    userId: "user-123",
    appName: "テストアプリ",
  },
};
