import type { Meta, StoryObj } from "@storybook/react";
import { Landing } from "@/components/landing/landing";

const meta: Meta<typeof Landing> = {
  title: "Components/Landing",
  component: Landing,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description:
        "Optional children content to display below the main content",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Landing>;

export const Default: Story = {
  args: {},
};

export const WithChildren: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
          管理画面へ
        </button>
        <p className="text-sm text-muted-foreground">
          アンケートを作成するには、まず管理画面にアクセスしてください。
        </p>
      </div>
    ),
  },
};
