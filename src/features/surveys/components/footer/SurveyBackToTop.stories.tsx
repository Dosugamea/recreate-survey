import type { Meta, StoryObj } from "@storybook/react";
import { SurveyBackToTop } from "@/features/surveys/components/footer/SurveyBackToTop";

const meta: Meta<typeof SurveyBackToTop> = {
  title: "Survey/SurveyBackToTop",
  component: SurveyBackToTop,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[640px] mx-auto bg-white shadow-xl p-8">
          <div className="h-[200vh]">
            <p className="mb-4">スクロールしてボタンを確認してください</p>
            <p className="mb-4">
              このストーリーでは、スクロール位置が300pxを超えるとボタンが表示されます。
            </p>
            <div className="h-[500px] bg-gray-100 rounded p-4 mb-4">
              <p>コンテンツエリア</p>
            </div>
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SurveyBackToTop>;

export const Default: Story = {
  args: {},
};
