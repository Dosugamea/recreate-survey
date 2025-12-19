import type { Meta, StoryObj } from "@storybook/react";
import { SurveyTitle } from "./SurveyTitle";

const meta: Meta<typeof SurveyTitle> = {
  title: "Survey/SurveyTitle",
  component: SurveyTitle,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SurveyTitle>;

export const Default: Story = {
  args: {
    title: "顧客満足度調査",
    headerImage: null,
  },
};

export const WithHeaderImage: Story = {
  args: {
    title: "顧客満足度調査",
    headerImage: "https://placehold.co/800x200/6c4034/ffffff?text=Header+Image",
  },
};

export const LongTitle: Story = {
  args: {
    title: "2024年度 第1四半期 顧客満足度調査アンケート",
    headerImage: null,
  },
};
