import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { fn } from "@storybook/test";
import { TodoFilters } from "./TodoFilters";

const meta = {
    title: "Components/TodoFilters",
    component: TodoFilters,
    parameters: {
        layout: "centered",
    },
    args: {
        onFilterChange: fn(),
    },
    decorators: [
        (Story) => (
            <div style={{ width: "500px", background: "white" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TodoFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSelected: Story = {
    args: {
        filter: "all",
        activeCount: 5,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Verify "All" button has active class
        const allButton = canvas.getByRole("button", { name: "All" });
        expect(allButton).toHaveClass("active");

        // Verify count is displayed
        expect(canvas.getByText("5 items left")).toBeInTheDocument();
    },
};

export const ActiveSelected: Story = {
    args: {
        filter: "active",
        activeCount: 3,
    },
};

export const CompletedSelected: Story = {
    args: {
        filter: "completed",
        activeCount: 0,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Verify "Completed" button has active class
        const completedButton = canvas.getByRole("button", { name: "Completed" });
        expect(completedButton).toHaveClass("active");

        // Verify count shows 0
        expect(canvas.getByText("0 items left")).toBeInTheDocument();
    },
};

export const FilterChangeInteraction: Story = {
    args: {
        filter: "all",
        activeCount: 2,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Click "Active" filter
        await userEvent.click(canvas.getByRole("button", { name: "Active" }));
        expect(args.onFilterChange).toHaveBeenCalledWith("active");

        // Click "Completed" filter
        await userEvent.click(canvas.getByRole("button", { name: "Completed" }));
        expect(args.onFilterChange).toHaveBeenCalledWith("completed");

        // Click "All" filter
        await userEvent.click(canvas.getByRole("button", { name: "All" }));
        expect(args.onFilterChange).toHaveBeenCalledWith("all");
    },
};
