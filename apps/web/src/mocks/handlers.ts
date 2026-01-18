import { http, HttpResponse } from "msw";

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

let todos: Todo[] = [];

export const resetTodos = (initialTodos: Todo[] = []) => {
    todos = [...initialTodos];
};

export const handlers = [
    http.get("/api/todos", () => {
        return HttpResponse.json(todos);
    }),

    http.post("/api/todos", async ({ request }) => {
        const body = (await request.json()) as { title: string };
        const newTodo: Todo = {
            id: String(Date.now()),
            title: body.title,
            completed: false,
        };
        todos.push(newTodo);
        return HttpResponse.json(newTodo, { status: 201 });
    }),

    http.patch("/api/todos/:id", async ({ params, request }) => {
        const { id } = params;
        const body = (await request.json()) as Partial<Todo>;
        const todoIndex = todos.findIndex((t) => t.id === id);
        if (todoIndex === -1) {
            return HttpResponse.json({ error: "Not found" }, { status: 404 });
        }
        todos[todoIndex] = { ...todos[todoIndex], ...body };
        return HttpResponse.json(todos[todoIndex]);
    }),

    http.delete("/api/todos/:id", ({ params }) => {
        const { id } = params;
        const todoIndex = todos.findIndex((t) => t.id === id);
        if (todoIndex === -1) {
            return HttpResponse.json({ error: "Not found" }, { status: 404 });
        }
        const deleted = todos.splice(todoIndex, 1)[0];
        return HttpResponse.json(deleted);
    }),
];
