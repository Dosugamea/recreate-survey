import type { Meta, StoryObj } from "@storybook/react";
import { SurveyFooter } from "@/features/surveys/components/footer/SurveyFooter";

const meta: Meta<typeof SurveyFooter> = {
  title: "Survey/SurveyFooter",
  component: SurveyFooter,
  tags: ["autodocs"],
  argTypes: {
    themeColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof SurveyFooter>;

export const Default: Story = {
  args: {
    links: [
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "お問い合わせ", href: "/contact" },
    ],
    copyright: "© 2024 テストアプリ",
    themeColor: "#5C4033",
  },
};

export const WithoutCopyright: Story = {
  args: {
    links: [
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "お問い合わせ", href: "/contact" },
    ],
    themeColor: "#5C4033",
  },
};

export const WithMultipleLinks: Story = {
  args: {
    links: [
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "利用規約", href: "/terms" },
      { label: "お問い合わせ", href: "/contact" },
      { label: "よくある質問", href: "/faq" },
    ],
    copyright: "© 2024 テストアプリ",
    themeColor: "#5C4033",
  },
};

export const BlueTheme: Story = {
  args: {
    links: [
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "お問い合わせ", href: "/contact" },
    ],
    copyright: "© 2024 テストアプリ",
    themeColor: "#2563eb",
  },
};

export const GreenTheme: Story = {
  args: {
    links: [
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "お問い合わせ", href: "/contact" },
    ],
    copyright: "© 2024 テストアプリ",
    themeColor: "#10b981",
  },
};
