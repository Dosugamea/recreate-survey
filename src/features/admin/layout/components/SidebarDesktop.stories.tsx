import type { Meta, StoryObj } from "@storybook/react";
import { SidebarDesktop } from "@/features/admin/layout/components/SidebarDesktop";

const meta: Meta<typeof SidebarDesktop> = {
  title: "Admin/Layout/SidebarDesktop",
  component: SidebarDesktop,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
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
};

export default meta;
type Story = StoryObj<typeof SidebarDesktop>;

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

export const OnSurveysCreatePage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/surveys/create",
      },
    },
  },
};

export const OnAnswersPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/answers",
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

export const OnAppsCreatePage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/apps/create",
      },
    },
  },
};

export const OnUsersPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/users",
      },
    },
  },
};

export const OnHelpPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/help",
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
