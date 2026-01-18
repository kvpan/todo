import { Trash2 } from "lucide-react";
import { Todo } from "../App";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <li className="flex items-center justify-between gap-3 rounded-lg border p-3 shadow-sm transition-all hover:bg-accent/50">
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo.id)}
                    id={`todo-${todo.id}`}
                />
                <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        todo.completed ? "line-through text-muted-foreground" : ""
                    }`}
                >
                    {todo.title}
                </label>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(todo.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
            </Button>
        </li>
    );
}
