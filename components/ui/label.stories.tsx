import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Label",
  },
};

export const WithHtmlFor: Story = {
  args: {
    htmlFor: "input-id",
    children: "Label for input",
  },
};

export const Required: Story = {
  args: {
    children: (
      <>
        Required Field <span className="text-destructive">*</span>
      </>
    ),
  },
};
