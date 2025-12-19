import type { Meta, StoryObj } from "@storybook/react";
import { SurveyThanks } from "./SurveyThanks";

const meta: Meta<typeof SurveyThanks> = {
  title: "Survey/SurveyThanks",
  component: SurveyThanks,
  tags: ["autodocs"],
  argTypes: {
    themeColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof SurveyThanks>;

export const Default: Story = {
  args: {
    show: true,
    themeColor: "#6c4034",
    appName: "テストアプリ",
  },
};

export const WithoutAppName: Story = {
  args: {
    show: true,
    themeColor: "#6c4034",
  },
};

export const Hidden: Story = {
  args: {
    show: false,
    themeColor: "#6c4034",
    appName: "テストアプリ",
  },
};

export const BlueTheme: Story = {
  args: {
    show: true,
    themeColor: "#2563eb",
    appName: "テストアプリ",
  },
};

export const GreenTheme: Story = {
  args: {
    show: true,
    themeColor: "#10b981",
    appName: "テストアプリ",
  },
};
