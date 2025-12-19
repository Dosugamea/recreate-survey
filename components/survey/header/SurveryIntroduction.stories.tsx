import type { Meta, StoryObj } from "@storybook/react";
import { SurveyIntroduction } from "./SurveryIntroduction";

const meta: Meta<typeof SurveyIntroduction> = {
  title: "Survey/SurveyIntroduction",
  component: SurveyIntroduction,
  tags: ["autodocs"],
  argTypes: {
    themeColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof SurveyIntroduction>;

export const Default: Story = {
  args: {
    themeColor: "#6c4034",
  },
};

export const BlueTheme: Story = {
  args: {
    themeColor: "#2563eb",
  },
};

export const GreenTheme: Story = {
  args: {
    themeColor: "#10b981",
  },
};
