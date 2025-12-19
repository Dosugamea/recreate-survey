import type { Meta, StoryObj } from "@storybook/react";
import { SurveyWarn } from "@/components/survey/messages/SurveyWarn";

const meta: Meta<typeof SurveyWarn> = {
  title: "Survey/SurveyWarn",
  component: SurveyWarn,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SurveyWarn>;

export const Default: Story = {
  args: {
    show: true,
  },
};

export const Hidden: Story = {
  args: {
    show: false,
  },
};
