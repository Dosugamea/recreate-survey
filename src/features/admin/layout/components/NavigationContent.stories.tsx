import type { Meta, StoryObj } from "@storybook/react";
import { NavigationContent } from "@/features/admin/layout/components/NavigationContent";

const meta: Meta<typeof NavigationContent> = {
  title: "Admin/Layout/NavigationContent",
  component: NavigationContent,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    nextjs: {
      navigation: {
        pathname: "/admin",
      },
    },
  },
  args: {
    userName: "テストユーザー",
    isAdmin: true,
  },
  decorators: [
    (Story) => (
      <div className="w-64 h-screen border relative bg-surface">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavigationContent>;

export const Default: Story = {};

export const OnSurveysPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/surveys",
      },
    },
  },
};

export const OnAppsPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/apps",
      },
    },
  },
};

export const NonAdminUser: Story = {
  args: {
    userName: "一般ユーザー",
    isAdmin: false,
  },
};
