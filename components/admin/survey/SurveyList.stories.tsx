import type { Meta, StoryObj } from "@storybook/react";
import { SurveyList } from "./SurveyList";

const meta: Meta<typeof SurveyList> = {
  title: "Admin/Survey/SurveyList",
  component: SurveyList,
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
type Story = StoryObj<typeof SurveyList>;

const mockApps = [
  { id: "app-1", name: "サンプルアンケートアプリ" },
  { id: "app-2", name: "顧客満足度調査アプリ" },
  { id: "app-3", name: "製品フィードバックアプリ" },
];

const mockSurveys = [
  {
    id: "survey-1",
    title: "2024年度 第1四半期 顧客満足度調査",
    slug: "enq-2024-Q1",
    isActive: true,
    createdAt: new Date("2024-01-15T10:30:00"),
    app: {
      id: "app-1",
      name: "サンプルアンケートアプリ",
      slug: "sample-app",
      faviconImageUrl: "https://via.placeholder.com/24",
    },
  },
  {
    id: "survey-2",
    title: "新製品フィードバック",
    slug: "product-feedback-2024",
    isActive: true,
    createdAt: new Date("2024-02-20T14:15:00"),
    app: {
      id: "app-2",
      name: "顧客満足度調査アプリ",
      slug: "customer-app",
      faviconImageUrl: "https://via.placeholder.com/24",
    },
  },
  {
    id: "survey-3",
    title: "イベント参加者アンケート",
    slug: "event-survey-2024",
    isActive: false,
    createdAt: new Date("2024-03-10T09:00:00"),
    app: {
      id: "app-1",
      name: "サンプルアンケートアプリ",
      slug: "sample-app",
      faviconImageUrl: null,
    },
  },
  {
    id: "survey-4",
    title: "社内満足度調査 2024年度",
    slug: "internal-satisfaction-2024",
    isActive: true,
    createdAt: new Date("2024-04-05T11:20:00"),
    app: {
      id: "app-3",
      name: "製品フィードバックアプリ",
      slug: "product-app",
      faviconImageUrl: "https://via.placeholder.com/24",
    },
  },
  {
    id: "survey-5",
    title: "マーケティングリサーチ 2024春",
    slug: "marketing-research-2024-spring",
    isActive: true,
    createdAt: new Date("2024-05-12T16:45:00"),
    app: {
      id: "app-2",
      name: "顧客満足度調査アプリ",
      slug: "customer-app",
      faviconImageUrl: "https://via.placeholder.com/24",
    },
  },
  {
    id: "survey-6",
    title: "ユーザー体験調査",
    slug: "ux-research-2024",
    isActive: true,
    createdAt: new Date("2024-06-01T13:30:00"),
    app: {
      id: "app-3",
      name: "製品フィードバックアプリ",
      slug: "product-app",
      faviconImageUrl: null,
    },
  },
];

export const Default: Story = {
  args: {
    apps: mockApps,
    surveys: mockSurveys,
  },
};

export const Empty: Story = {
  args: {
    apps: mockApps,
    surveys: [],
  },
};

export const WithFilteredApp: Story = {
  args: {
    apps: mockApps,
    surveys: mockSurveys.filter((s) => s.app.id === "app-1"),
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

export const SingleSurvey: Story = {
  args: {
    apps: mockApps,
    surveys: [mockSurveys[0]],
  },
};

export const NoApps: Story = {
  args: {
    apps: [],
    surveys: mockSurveys,
  },
};

export const ManySurveys: Story = {
  args: {
    apps: mockApps,
    surveys: [
      ...mockSurveys,
      {
        id: "survey-7",
        title: "追加アンケート 1",
        slug: "additional-1",
        isActive: true,
        createdAt: new Date("2024-07-01T10:00:00"),
        app: {
          id: "app-1",
          name: "サンプルアンケートアプリ",
          slug: "sample-app",
          faviconImageUrl: "https://via.placeholder.com/24",
        },
      },
      {
        id: "survey-8",
        title: "追加アンケート 2",
        slug: "additional-2",
        isActive: false,
        createdAt: new Date("2024-07-02T11:00:00"),
        app: {
          id: "app-2",
          name: "顧客満足度調査アプリ",
          slug: "customer-app",
          faviconImageUrl: "https://via.placeholder.com/24",
        },
      },
      {
        id: "survey-9",
        title: "追加アンケート 3",
        slug: "additional-3",
        isActive: true,
        createdAt: new Date("2024-07-03T12:00:00"),
        app: {
          id: "app-3",
          name: "製品フィードバックアプリ",
          slug: "product-app",
          faviconImageUrl: null,
        },
      },
    ],
  },
};
