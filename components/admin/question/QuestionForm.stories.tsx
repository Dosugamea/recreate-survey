import type { Meta, StoryObj } from "@storybook/react";
import { QuestionForm } from "@/components/admin/question/QuestionForm";
import { fn } from "@storybook/test";

const meta: Meta<typeof QuestionForm> = {
  title: "Admin/Question/QuestionForm",
  component: QuestionForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    surveyId: "survey-1",
    onSuccess: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof QuestionForm>;

export const Default: Story = {};

export const EditMode: Story = {
  args: {
    surveyId: "survey-1",
    onSuccess: fn(),
    question: {
      id: "question-1",
      type: "RADIO",
      label: "好きな色は何ですか？",
      required: true,
      maxLength: null,
      options: JSON.stringify(["赤", "青", "緑", "黄"]),
      order: 1,
    },
  },
};

export const EditModeWithText: Story = {
  args: {
    surveyId: "survey-1",
    onSuccess: fn(),
    question: {
      id: "question-2",
      type: "TEXT",
      label: "ご意見をお聞かせください",
      required: false,
      maxLength: 500,
      options: null,
      order: 2,
    },
  },
};

export const EditModeWithEmail: Story = {
  args: {
    surveyId: "survey-1",
    onSuccess: fn(),
    question: {
      id: "question-3",
      type: "EMAIL",
      label: "メールアドレスを入力してください",
      required: true,
      maxLength: 255,
      options: null,
      order: 3,
    },
  },
};

export const EditModeWithCheckbox: Story = {
  args: {
    surveyId: "survey-1",
    onSuccess: fn(),
    question: {
      id: "question-4",
      type: "CHECKBOX",
      label: "興味のある分野を選択してください（複数選択可）",
      required: false,
      maxLength: null,
      options: JSON.stringify(["技術", "デザイン", "マーケティング", "営業"]),
      order: 4,
    },
  },
};

export const EditModeWithSelect: Story = {
  args: {
    surveyId: "survey-1",
    onSuccess: fn(),
    question: {
      id: "question-5",
      type: "SELECT",
      label: "年齢層を選択してください",
      required: true,
      maxLength: null,
      options: JSON.stringify(["10代", "20代", "30代", "40代", "50代以上"]),
      order: 5,
    },
  },
};
