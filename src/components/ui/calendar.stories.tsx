import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "@/components/ui/calendar";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "multiple", "range"],
    },
    buttonVariant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    mode: "single",
  },
};

export const Multiple: Story = {
  args: {
    mode: "multiple",
  },
};

export const Range: Story = {
  args: {
    mode: "range",
  },
};

export const WithWeekNumbers: Story = {
  args: {
    mode: "single",
    showWeekNumber: true,
  },
};
