import type { Meta, StoryObj } from "@storybook/react";
import { EditSurveyForm } from "@/features/admin/surveys/components/edit/EditSurveyForm";

const meta: Meta<typeof EditSurveyForm> = {
  title: "Admin/Survey/EditSurveyForm",
  component: EditSurveyForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof EditSurveyForm>;

const mockSurvey = {
  id: "survey-1",
  appId: "app-1",
  title: "2024年度 第1四半期 顧客満足度調査",
  slug: "enq-2024-Q1",
  description: "このアンケートにご記入ください。",
  notes: "回答は匿名で処理されます。",
  startAt: new Date("2024-01-01"),
  endAt: new Date("2024-03-31"),
  themeColor: "#6c4034",
  headerImage: "https://placehold.co/800x200/6c4034/ffffff?text=Header+Image",
  bgImage: null,
  isActive: true,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  webhookUrl: "https://example.com/webhook",
};

export const Default: Story = {
  args: {
    survey: mockSurvey,
  },
};

export const WithMinimalData: Story = {
  args: {
    survey: {
      ...mockSurvey,
      description: null,
      notes: null,
      startAt: new Date("2024-01-01"),
      endAt: new Date("2024-03-31"),
      headerImage: null,
      bgImage: null,
    },
  },
};

export const Inactive: Story = {
  args: {
    survey: {
      ...mockSurvey,
      isActive: false,
    },
  },
};

export const WithBackgroundImage: Story = {
  args: {
    survey: {
      ...mockSurvey,
      bgImage: "https://placehold.co/1920x1080/f0f0f0/666666?text=Background",
    },
  },
};
