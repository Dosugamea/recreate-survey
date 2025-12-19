import type { Meta, StoryObj } from "@storybook/react";
import { CreateSurveyForm } from "@/components/admin/survey/CreateSurveyForm";

const meta: Meta<typeof CreateSurveyForm> = {
  title: "Admin/Survey/CreateSurveyForm",
  component: CreateSurveyForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof CreateSurveyForm>;

export const Default: Story = {};
