import { useState, useEffect } from "react";
import { TodoInput } from "./components/TodoInput";
import { TodoList } from "./components/TodoList";
import { TodoFilters, FilterType } from "./components/TodoFilters";
import "./App.css";

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<FilterType>("all");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await fetch("/api/todos");
            if (res.ok) {
                const data = await res.json();
                setTodos(data);
            }
        } catch (error) {
            console.error("Failed to fetch todos:", error);
        }
    };

    const addTodo = async (title: string) => {
        try {
            const res = await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            if (res.ok) {
                const newTodo = await res.json();
                setTodos([...todos, newTodo]);
            }
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    };

    const toggleTodo = async (id: string) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;

        try {
            const res = await fetch(`/api/todos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !todo.completed }),
            });
            if (res.ok) {
                setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
            }
        } catch (error) {
            console.error("Failed to toggle todo:", error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
            if (res.ok) {
                setTodos(todos.filter((t) => t.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const filteredTodos = todos.filter((todo) => {
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
    });

    const activeCount = todos.filter((t) => !t.completed).length;

    return (
        <div className="todo-app">
            <h1>todos</h1>
            <div className="todo-container">
                <TodoInput onAdd={addTodo} />
                <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
                <TodoFilters filter={filter} onFilterChange={setFilter} activeCount={activeCount} />
            </div>
        </div>
    );
}

export default App;
