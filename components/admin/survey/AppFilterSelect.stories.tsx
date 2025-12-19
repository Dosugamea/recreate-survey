import type { Meta, StoryObj } from "@storybook/react";
import { AppFilterSelect } from "./AppFilterSelect";

const meta: Meta<typeof AppFilterSelect> = {
  title: "Admin/Survey/AppFilterSelect",
  component: AppFilterSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    nextjs: {
      navigation: {
        pathname: "/admin/surveys",
        query: {},
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppFilterSelect>;

const mockApps = [
  { id: "app-1", name: "サンプルアンケートアプリ" },
  { id: "app-2", name: "顧客満足度調査アプリ" },
  { id: "app-3", name: "製品フィードバックアプリ" },
];

export const Default: Story = {
  args: {
    apps: mockApps,
  },
};

export const WithCurrentApp: Story = {
  args: {
    apps: mockApps,
    currentAppId: "app-1",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/admin/surveys",
        query: { appId: "app-1" },
      },
    },
  },
};

export const WithManyApps: Story = {
  args: {
    apps: [
      ...mockApps,
      { id: "app-4", name: "イベントアンケートアプリ" },
      { id: "app-5", name: "社内調査アプリ" },
      { id: "app-6", name: "マーケティングリサーチアプリ" },
      { id: "app-7", name: "ユーザー体験調査アプリ" },
    ],
  },
};

export const Empty: Story = {
  args: {
    apps: [],
  },
};
