import type { Meta, StoryObj } from "@storybook/react";
import { FormInputView } from "@/components/survey/form/FormInputView";
import { fn } from "storybook/test";
import type { FieldError } from "react-hook-form";

const meta: Meta<typeof FormInputView> = {
  title: "Survey/FormInputView",
  component: FormInputView,
  tags: ["autodocs"],
  argTypes: {
    themeColor: { control: "color" },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof FormInputView>;

// Mock register function
const mockRegister = fn(() => ({
  name: "test",
  onChange: async () => {},
  onBlur: async () => {},
  ref: () => {},
}));

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
];

export const Default: Story = {
  args: {
    questions: baseQuestions,
    register: mockRegister as any,
    themeColor: "#6c4034",
    errors: {},
    isAllRequiredFieldsFilled: false,
    onGoToConfirmation: fn(),
  },
};

export const AllFieldsFilled: Story = {
  args: {
    questions: baseQuestions,
    register: mockRegister as any,
    themeColor: "#6c4034",
    errors: {},
    isAllRequiredFieldsFilled: true,
    onGoToConfirmation: fn(),
  },
};

export const WithErrors: Story = {
  args: {
    questions: baseQuestions,
    register: mockRegister as any,
    themeColor: "#6c4034",
    errors: {
      "q-1": { message: "Required", type: "required" } as FieldError,
      "q-2": { message: "Required", type: "required" } as FieldError,
    },
    isAllRequiredFieldsFilled: false,
    onGoToConfirmation: fn(),
  },
};

export const BlueTheme: Story = {
  args: {
    questions: baseQuestions,
    register: mockRegister as any,
    themeColor: "#2563eb",
    errors: {},
    isAllRequiredFieldsFilled: true,
    onGoToConfirmation: fn(),
  },
};
