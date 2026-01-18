import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { fn } from "@storybook/test";
import { TodoInput } from "./TodoInput";

const meta = {
    title: "Components/TodoInput",
    component: TodoInput,
    parameters: {
        layout: "centered",
    },
    args: {
        onAdd: fn(),
    },
    decorators: [
        (Story) => (
            <div style={{ width: "500px", background: "white" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TodoInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TypeAndSubmit: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByPlaceholderText("What needs to be done?");

        // Type a todo
        await userEvent.type(input, "Buy groceries");
        expect(input).toHaveValue("Buy groceries");

        // Press Enter to submit
        await userEvent.keyboard("{Enter}");

        // Verify onAdd was called with the correct value
        expect(args.onAdd).toHaveBeenCalledWith("Buy groceries");

        // Input should be cleared after submit
        expect(input).toHaveValue("");
    },
};

export const EmptySubmitIgnored: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        // Focus the input
        canvas.getByPlaceholderText("What needs to be done?").focus();

        // Try to submit empty input
        await userEvent.keyboard("{Enter}");

        // onAdd should not be called
        expect(args.onAdd).not.toHaveBeenCalled();
    },
};

export const WhitespaceOnlyIgnored: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByPlaceholderText("What needs to be done?");

        // Type only whitespace
        await userEvent.type(input, "   ");
        await userEvent.keyboard("{Enter}");

        // onAdd should not be called for whitespace-only input
        expect(args.onAdd).not.toHaveBeenCalled();
    },
};
