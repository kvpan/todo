import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import { http, HttpResponse } from "msw";
import App from "./App";

const mockTodos = [
    { id: "1", title: "Learn React", completed: false },
    { id: "2", title: "Setup Storybook", completed: true },
    { id: "3", title: "Build TODO App", completed: false },
];

const meta = {
    title: "App/TodoApp",
    component: App,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{ width: "550px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    parameters: {
        msw: {
            handlers: [http.get("/api/todos", () => HttpResponse.json([]))],
        },
    },
};

export const WithTodos: Story = {
    parameters: {
        msw: {
            handlers: [http.get("/api/todos", () => HttpResponse.json(mockTodos))],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for todos to load
        await waitFor(() => {
            expect(canvas.getByText("Learn React")).toBeInTheDocument();
        });

        // Verify all todos are displayed
        expect(canvas.getByText("Setup Storybook")).toBeInTheDocument();
        expect(canvas.getByText("Build TODO App")).toBeInTheDocument();

        // Verify count
        expect(canvas.getByText("2 items left")).toBeInTheDocument();
    },
};

export const AddTodo: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get("/api/todos", () => HttpResponse.json([])),
                http.post("/api/todos", async ({ request }) => {
                    const body = (await request.json()) as { title: string };
                    return HttpResponse.json(
                        {
                            id: "999",
                            title: body.title,
                            completed: false,
                        },
                        { status: 201 },
                    );
                }),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByPlaceholderText("What needs to be done?");

        // Type a new todo and press Enter
        await userEvent.type(input, "New todo item{enter}");

        // Wait for the todo to appear
        await waitFor(() => {
            expect(canvas.getByText("New todo item")).toBeInTheDocument();
        });

        // Input should be cleared
        expect(input).toHaveValue("");
    },
};

export const ToggleTodo: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get("/api/todos", () =>
                    HttpResponse.json([{ id: "1", title: "Toggle me", completed: false }]),
                ),
                http.patch("/api/todos/:id", () =>
                    HttpResponse.json({
                        id: "1",
                        title: "Toggle me",
                        completed: true,
                    }),
                ),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for todo to load
        await waitFor(() => {
            expect(canvas.getByText("Toggle me")).toBeInTheDocument();
        });

        // Click the checkbox
        const checkbox = canvas.getByRole("checkbox");
        await userEvent.click(checkbox);

        // Verify the todo is marked as completed (has strikethrough style)
        await waitFor(() => {
            expect(checkbox).toBeChecked();
        });
    },
};

export const DeleteTodo: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get("/api/todos", () =>
                    HttpResponse.json([{ id: "1", title: "Delete me", completed: false }]),
                ),
                http.delete("/api/todos/:id", () =>
                    HttpResponse.json({
                        id: "1",
                        title: "Delete me",
                        completed: false,
                    }),
                ),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for todo to load
        await waitFor(() => {
            expect(canvas.getByText("Delete me")).toBeInTheDocument();
        });

        // Click the delete button
        const deleteButton = canvas.getByRole("button", { name: "×" });
        await userEvent.click(deleteButton);

        // Verify the todo is removed
        await waitFor(() => {
            expect(canvas.queryByText("Delete me")).not.toBeInTheDocument();
        });
    },
};

export const FilterTodos: Story = {
    parameters: {
        msw: {
            handlers: [http.get("/api/todos", () => HttpResponse.json(mockTodos))],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for todos to load
        await waitFor(() => {
            expect(canvas.getByText("Learn React")).toBeInTheDocument();
        });

        // Click "Active" filter
        await userEvent.click(canvas.getByRole("button", { name: "Active" }));

        // Completed todo should be hidden
        await waitFor(() => {
            expect(canvas.queryByText("Setup Storybook")).not.toBeInTheDocument();
        });
        expect(canvas.getByText("Learn React")).toBeInTheDocument();
        expect(canvas.getByText("Build TODO App")).toBeInTheDocument();

        // Click "Completed" filter
        await userEvent.click(canvas.getByRole("button", { name: "Completed" }));

        // Only completed todo should be visible
        await waitFor(() => {
            expect(canvas.getByText("Setup Storybook")).toBeInTheDocument();
        });
        expect(canvas.queryByText("Learn React")).not.toBeInTheDocument();

        // Click "All" filter
        await userEvent.click(canvas.getByRole("button", { name: "All" }));

        // All todos should be visible again
        await waitFor(() => {
            expect(canvas.getByText("Learn React")).toBeInTheDocument();
            expect(canvas.getByText("Setup Storybook")).toBeInTheDocument();
        });
    },
};
