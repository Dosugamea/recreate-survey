import type { Meta, StoryObj } from "@storybook/react";
import { SurveyHeader } from "./SurveyHeader";

const meta: Meta<typeof SurveyHeader> = {
  title: "Survey/SurveyHeader",
  component: SurveyHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SurveyHeader>;

const baseSurvey = {
  id: "survey-1",
  slug: "test-survey",
  title: "顧客満足度調査",
  description:
    "いつもご利用ありがとうございます。\n今後のサービス向上のため、アンケートにご協力ください。",
  startAt: new Date("2024-01-01"),
  endAt: new Date("2024-12-31"),
  themeColor: "#6c4034",
  headerImage: "https://placehold.co/800x200/6c4034/ffffff?text=Header+Image",
  bgImage: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const Default: Story = {
  args: {
    survey: baseSurvey,
  },
};

export const WithoutImage: Story = {
  args: {
    survey: {
      ...baseSurvey,
      headerImage: null,
    },
  },
};

export const BlueTheme: Story = {
  args: {
    survey: {
      ...baseSurvey,
      themeColor: "#2563eb",
      headerImage:
        "https://placehold.co/800x200/2563eb/ffffff?text=Blue+Header",
    },
  },
};
