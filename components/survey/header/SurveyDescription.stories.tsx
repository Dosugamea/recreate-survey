import type { Meta, StoryObj } from "@storybook/react";
import { SurveyDescription } from "@/components/survey/header/SurveyDescription";

const meta: Meta<typeof SurveyDescription> = {
  title: "Survey/SurveyDescription",
  component: SurveyDescription,
  tags: ["autodocs"],
  argTypes: {
    themeColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof SurveyDescription>;

export const Default: Story = {
  args: {
    description:
      "いつもご利用ありがとうございます。\n今後のサービス向上のため、アンケートにご協力ください。",
    themeColor: "#6c4034",
    periodMessage: "実施期間: 2024年12月31日 23:59まで",
  },
};

export const WithoutDescription: Story = {
  args: {
    description: null,
    themeColor: "#6c4034",
    periodMessage: "実施期間: 2024年12月31日 23:59まで",
  },
};

export const WithoutPeriod: Story = {
  args: {
    description:
      "いつもご利用ありがとうございます。\n今後のサービス向上のため、アンケートにご協力ください。",
    themeColor: "#6c4034",
    periodMessage: null,
  },
};

export const WithLongDescription: Story = {
  args: {
    description: `いつもご利用ありがとうございます。

今後のサービス向上のため、アンケートにご協力ください。

【回答方法】
・各質問にお答えください
・必須項目には「*必須」のマークがついています
・回答は一度送信すると変更できません

【回答期間】
2024年1月1日 〜 2024年12月31日

ご協力よろしくお願いいたします。`,
    themeColor: "#6c4034",
    periodMessage: "実施期間: 2024年12月31日 23:59まで",
  },
};

export const BlueTheme: Story = {
  args: {
    description:
      "いつもご利用ありがとうございます。\n今後のサービス向上のため、アンケートにご協力ください。",
    themeColor: "#2563eb",
    periodMessage: "実施期間: 2024年12月31日 23:59まで",
  },
};

export const GreenTheme: Story = {
  args: {
    description:
      "いつもご利用ありがとうございます。\n今後のサービス向上のため、アンケートにご協力ください。",
    themeColor: "#10b981",
    periodMessage: "実施期間: 2024年12月31日 23:59まで",
  },
};
