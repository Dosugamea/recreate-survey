import type { Meta, StoryObj } from "@storybook/react";
import { SubmitButton } from "@/components/survey/form/SubmitButton";

const meta: Meta<typeof SubmitButton> = {
  title: "Survey/SubmitButton",
  component: SubmitButton,
  tags: ["autodocs"],
  argTypes: {
    themeColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof SubmitButton>;

export const Default: Story = {
  args: {
    isPending: false,
    themeColor: "#6c4034",
  },
};

export const Pending: Story = {
  args: {
    isPending: true,
    themeColor: "#6c4034",
  },
};

export const BlueTheme: Story = {
  args: {
    isPending: false,
    themeColor: "#2563eb",
  },
};

export const GreenTheme: Story = {
  args: {
    isPending: false,
    themeColor: "#10b981",
  },
};
