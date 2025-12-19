import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmationView } from "./ConfirmationView";
import { fn } from "storybook/test";

const meta: Meta<typeof ConfirmationView> = {
  title: "Survey/ConfirmationView",
  component: ConfirmationView,
  tags: ["autodocs"],
  argTypes: {
    themeColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationView>;

const baseQuestions = [
  {
    id: "q-1",
    surveyId: "s-1",
    order: 1,
    type: "TEXT" as const,
    label: "お名前を教えてください",
    required: true,
    maxLength: null,
    options: null,
  },
  {
    id: "q-2",
    surveyId: "s-1",
    order: 2,
    type: "EMAIL" as const,
    label: "メールアドレス",
    required: true,
    maxLength: null,
    options: null,
  },
  {
    id: "q-3",
    surveyId: "s-1",
    order: 3,
    type: "RADIO" as const,
    label: "あなたの性別を教えてください",
    required: false,
    maxLength: null,
    options: JSON.stringify(["男性", "女性", "その他"]),
  },
  {
    id: "q-4",
    surveyId: "s-1",
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

const baseFormData = {
  "q-1": "山田太郎",
  "q-2": "yamada@example.com",
  "q-3": "男性",
  "q-4": ["テクノロジー", "ビジネス"],
};

export const Default: Story = {
  args: {
    questions: baseQuestions,
    formData: baseFormData,
    themeColor: "#6c4034",
    isPending: false,
    onBack: fn(),
    onSubmit: fn(),
  },
};

export const WithUnanswered: Story = {
  args: {
    questions: baseQuestions,
    formData: {
      "q-1": "山田太郎",
      "q-2": "",
      "q-3": "男性",
    },
    themeColor: "#6c4034",
    isPending: false,
    onBack: fn(),
    onSubmit: fn(),
  },
};

export const WithCheckboxAnswers: Story = {
  args: {
    questions: baseQuestions,
    formData: {
      ...baseFormData,
      "q-4": ["テクノロジー", "ビジネス", "デザイン", "マーケティング"],
    },
    themeColor: "#6c4034",
    isPending: false,
    onBack: fn(),
    onSubmit: fn(),
  },
};

export const Pending: Story = {
  args: {
    questions: baseQuestions,
    formData: baseFormData,
    themeColor: "#6c4034",
    isPending: true,
    onBack: fn(),
    onSubmit: fn(),
  },
};

export const BlueTheme: Story = {
  args: {
    questions: baseQuestions,
    formData: baseFormData,
    themeColor: "#2563eb",
    isPending: false,
    onBack: fn(),
    onSubmit: fn(),
  },
};

export const GreenTheme: Story = {
  args: {
    questions: baseQuestions,
    formData: baseFormData,
    themeColor: "#10b981",
    isPending: false,
    onBack: fn(),
    onSubmit: fn(),
  },
};
