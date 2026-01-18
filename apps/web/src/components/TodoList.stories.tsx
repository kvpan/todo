import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TodoList } from "./TodoList";

const meta = {
    title: "Components/TodoList",
    component: TodoList,
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
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        todos: [],
    },
};

export const WithTodos: Story = {
    args: {
        todos: [
            { id: "1", title: "Learn React", completed: false },
            { id: "2", title: "Setup Storybook", completed: true },
            { id: "3", title: "Build TODO App", completed: false },
        ],
    },
};

export const AllCompleted: Story = {
    args: {
        todos: [
            { id: "1", title: "Task 1", completed: true },
            { id: "2", title: "Task 2", completed: true },
        ],
    },
};
