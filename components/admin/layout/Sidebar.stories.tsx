import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "@/components/admin/layout/Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Admin/Layout/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        pathname: "/admin",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

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

export const OnHelpPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/help",
      },
    },
  },
};
