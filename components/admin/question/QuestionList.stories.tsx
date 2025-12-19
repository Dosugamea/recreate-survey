import type { Meta, StoryObj } from "@storybook/react";
import { QuestionList } from "./QuestionList";

const meta: Meta<typeof QuestionList> = {
  title: "Admin/Question/QuestionList",
  component: QuestionList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    surveyId: "survey-1",
  },
};

export default meta;
type Story = StoryObj<typeof QuestionList>;

const mockQuestions = [
  {
    id: "question-1",
    type: "RADIO",
    label: "好きな色は何ですか？",
    required: true,
    maxLength: null,
    options: JSON.stringify(["赤", "青", "緑", "黄"]),
    order: 1,
  },
  {
    id: "question-2",
    type: "TEXT",
    label: "ご意見をお聞かせください",
    required: false,
    maxLength: 500,
    options: null,
    order: 2,
  },
  {
    id: "question-3",
    type: "EMAIL",
    label: "メールアドレスを入力してください",
    required: true,
    maxLength: 255,
    options: null,
    order: 3,
  },
];

export const Empty: Story = {
  args: {
    surveyId: "survey-1",
    questions: [],
  },
};

export const Default: Story = {
  args: {
    surveyId: "survey-1",
    questions: mockQuestions,
  },
};

export const WithManyQuestions: Story = {
  args: {
    surveyId: "survey-1",
    questions: [
      ...mockQuestions,
      {
        id: "question-4",
        type: "CHECKBOX",
        label: "興味のある分野を選択してください（複数選択可）",
        required: false,
        maxLength: null,
        options: JSON.stringify(["技術", "デザイン", "マーケティング", "営業"]),
        order: 4,
      },
      {
        id: "question-5",
        type: "SELECT",
        label: "年齢層を選択してください",
        required: true,
        maxLength: null,
        options: JSON.stringify(["10代", "20代", "30代", "40代", "50代以上"]),
        order: 5,
      },
      {
        id: "question-6",
        type: "TEXT",
        label: "その他のご意見",
        required: false,
        maxLength: 1000,
        options: null,
        order: 6,
      },
    ],
  },
};

export const WithLongLabels: Story = {
  args: {
    surveyId: "survey-1",
    questions: [
      {
        id: "question-1",
        type: "TEXT",
        label:
          "このアンケートに関するご意見やご感想、改善点など、自由にご記入ください。できるだけ具体的にご記入いただけると、今後のサービス改善に役立ちます。",
        required: false,
        maxLength: 2000,
        options: null,
        order: 1,
      },
    ],
  },
};
