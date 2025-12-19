import type { Meta, StoryObj } from "@storybook/react";
import { CreateAppForm } from "./CreateAppForm";

const meta: Meta<typeof CreateAppForm> = {
  title: "Admin/App/CreateAppForm",
  component: CreateAppForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof CreateAppForm>;

export const Default: Story = {};
