import type { Meta, StoryObj } from "@storybook/react";
import { EditAppForm } from "@/features/admin/apps/components/EditAppForm";

const meta: Meta<typeof EditAppForm> = {
  title: "Admin/App/EditAppForm",
  component: EditAppForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof EditAppForm>;

const mockApp = {
  id: "app-1",
  name: "サンプルアンケートアプリ",
  slug: "sample-app",
  privacyPolicyUrl: "https://example.com/privacy",
  faviconImageUrl: "https://example.com/favicon.ico",
  copyrightNotice: "© 2025 株式会社サンプル",
  contactUrl: "https://example.com/contact",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const Default: Story = {
  args: {
    app: mockApp,
  },
};

export const WithMinimalData: Story = {
  args: {
    app: {
      ...mockApp,
      privacyPolicyUrl: null,
      faviconImageUrl: null,
      copyrightNotice: null,
      contactUrl: null,
    },
  },
};
