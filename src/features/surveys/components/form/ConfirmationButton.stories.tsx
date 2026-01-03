import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmationButton } from "@/features/surveys/components/form/ConfirmationButton";
import { fn } from "storybook/test";

const meta: Meta<typeof ConfirmationButton> = {
  title: "Survey/ConfirmationButton",
  component: ConfirmationButton,
  tags: ["autodocs"],
  argTypes: {
    themeColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationButton>;

export const Default: Story = {
  args: {
    onClick: fn(),
    disabled: false,
    themeColor: "#6c4034",
  },
};

export const Disabled: Story = {
  args: {
    onClick: fn(),
    disabled: true,
    themeColor: "#6c4034",
  },
};

export const BlueTheme: Story = {
  args: {
    onClick: fn(),
    disabled: false,
    themeColor: "#2563eb",
  },
};

export const GreenTheme: Story = {
  args: {
    onClick: fn(),
    disabled: false,
    themeColor: "#10b981",
  },
};
