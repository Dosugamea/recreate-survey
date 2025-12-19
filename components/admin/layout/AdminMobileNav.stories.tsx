import type { Meta, StoryObj } from "@storybook/react";
import { AdminMobileNav } from "./AdminMobileNav";

const meta: Meta<typeof AdminMobileNav> = {
  title: "Admin/Layout/AdminMobileNav",
  component: AdminMobileNav,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    nextjs: {
      navigation: {
        pathname: "/admin/surveys",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdminMobileNav>;

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
