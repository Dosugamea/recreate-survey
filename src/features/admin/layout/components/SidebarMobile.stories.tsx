import type { Meta, StoryObj } from "@storybook/react";
import { SidebarMobile } from "@/features/admin/layout/components/SidebarMobile";

const meta: Meta<typeof SidebarMobile> = {
  title: "Admin/Layout/SidebarMobile",
  component: SidebarMobile,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    nextjs: {
      navigation: {
        pathname: "/admin/surveys",
      },
    },
  },
  args: {
    userName: "テストユーザー",
    isAdmin: true,
  },
};

export default meta;
type Story = StoryObj<typeof SidebarMobile>;

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
