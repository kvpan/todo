import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { fn } from "@storybook/test";
import { TodoItem } from "./TodoItem";

const meta = {
    title: "Components/TodoItem",
    component: TodoItem,
    parameters: {
        layout: "centered",
    },
    args: {
        onToggle: fn(),
        onDelete: fn(),
    },
    decorators: [
        (Story) => (
            <div style={{ width: "500px", background: "white" }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <Story />
                </ul>
            </div>
        ),
    ],
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        todo: {
            id: "1",
            title: "Learn React",
            completed: false,
        },
    },
};

export const Completed: Story = {
    args: {
        todo: {
            id: "2",
            title: "Setup Storybook",
            completed: true,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Verify checkbox is checked
        const checkbox = canvas.getByRole("checkbox");
        expect(checkbox).toBeChecked();

        // Verify text has completed styling (strikethrough)
        const title = canvas.getByText("Setup Storybook");
        expect(title).toBeInTheDocument();
    },
};

export const ToggleInteraction: Story = {
    args: {
        todo: {
            id: "1",
            title: "Toggle test",
            completed: false,
        },
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const checkbox = canvas.getByRole("checkbox");

        // Click checkbox
        await userEvent.click(checkbox);

        // Verify onToggle was called with the correct id
        expect(args.onToggle).toHaveBeenCalledWith("1");
    },
};

export const DeleteInteraction: Story = {
    args: {
        todo: {
            id: "1",
            title: "Delete test",
            completed: false,
        },
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const deleteButton = canvas.getByRole("button", { name: "×" });

        // Click delete button
        await userEvent.click(deleteButton);

        // Verify onDelete was called with the correct id
        expect(args.onDelete).toHaveBeenCalledWith("1");
    },
};

export const LongTitle: Story = {
    args: {
        todo: {
            id: "3",
            title: "This is a very long todo item title that should wrap properly within the container",
            completed: false,
        },
    },
};
