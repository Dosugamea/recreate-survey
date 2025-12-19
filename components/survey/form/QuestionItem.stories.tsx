import type { Meta, StoryObj } from "@storybook/react";
import { QuestionItem } from "@/components/survey/form/QuestionItem";
import { fn } from "@storybook/test";
import type { UseFormRegister } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

const meta: Meta<typeof QuestionItem> = {
  title: "Survey/QuestionItem",
  component: QuestionItem,
  tags: ["autodocs"],
  argTypes: {
    themeColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof QuestionItem>;

// Mock register function
const mockRegister = fn(() => ({
  name: "test",
  onChange: async () => {},
  onBlur: async () => {},
  ref: () => {},
})) as unknown as UseFormRegister<FieldValues>;

const baseQuestion = {
  id: "q-1",
  surveyId: "s-1",
  order: 1,
  required: true,
  maxLength: null,
  options: null,
};

export const TextQuestion: Story = {
  args: {
    question: {
      ...baseQuestion,
      type: "TEXT",
      label: "お名前を教えてください",
    },
    register: mockRegister,
    themeColor: "#6c4034",
  },
};

export const EmailQuestion: Story = {
  args: {
    question: {
      ...baseQuestion,
      type: "EMAIL",
      label: "メールアドレス",
    },
    register: mockRegister,
    themeColor: "#6c4034",
  },
};

export const RadioQuestion: Story = {
  args: {
    question: {
      ...baseQuestion,
      type: "RADIO",
      label: "あなたの性別を教えてください",
      options: JSON.stringify(["男性", "女性", "その他"]),
    },
    register: mockRegister,
    themeColor: "#6c4034",
  },
};

export const CheckboxQuestion: Story = {
  args: {
    question: {
      ...baseQuestion,
      type: "CHECKBOX",
      label: "興味のあるジャンル（複数回答可）",
      options: JSON.stringify([
        "テクノロジー",
        "ビジネス",
        "デザイン",
        "マーケティング",
      ]),
    },
    register: mockRegister,
    themeColor: "#6c4034",
  },
};

export const SelectQuestion: Story = {
  args: {
    question: {
      ...baseQuestion,
      type: "SELECT",
      label: "お住まいの地域",
      options: JSON.stringify([
        "北海道",
        "東北",
        "関東",
        "中部",
        "近畿",
        "中国",
        "四国",
        "九州/沖縄",
      ]),
    },
    register: mockRegister,
    themeColor: "#6c4034",
  },
};

export const WithError: Story = {
  args: {
    question: {
      ...baseQuestion,
      type: "TEXT",
      label: "必須項目です",
    },
    register: mockRegister,
    themeColor: "#6c4034",
    error: "Required",
  },
};
