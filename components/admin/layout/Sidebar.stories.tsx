import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";

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

export const OnAppsPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/apps/123",
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
