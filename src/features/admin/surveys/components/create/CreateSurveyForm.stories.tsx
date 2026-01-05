import type { Meta, StoryObj } from "@storybook/react";
import { CreateSurveyForm } from "@/features/admin/surveys/components/create/CreateSurveyForm";

const meta: Meta<typeof CreateSurveyForm> = {
  title: "Admin/Survey/CreateSurveyForm",
  component: CreateSurveyForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof CreateSurveyForm>;

export const Default: Story = {
  args: {
    apps: [
      {
        id: "app-1",
        name: "サンプルアプリ1",
        slug: "sample-app-1",
        privacyPolicyUrl: null,
        faviconImageUrl: null,
        copyrightNotice: null,
        contactUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "app-2",
        name: "サンプルアプリ2",
        slug: "sample-app-2",
        privacyPolicyUrl: null,
        faviconImageUrl: null,
        copyrightNotice: null,
        contactUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
};
