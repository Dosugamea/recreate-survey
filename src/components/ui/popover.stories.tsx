import type { Meta, StoryObj } from "@storybook/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium">Popover Title</h4>
          <p className="text-sm text-muted-foreground">
            This is the popover content. It can contain any React elements.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Settings</h4>
          <div className="space-y-2">
            <label className="text-sm font-medium">Width</label>
            <input
              type="number"
              className="w-full px-2 py-1 border rounded"
              defaultValue={100}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Height</label>
            <input
              type="number"
              className="w-full px-2 py-1 border rounded"
              defaultValue={100}
            />
          </div>
          <Button className="w-full">Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
