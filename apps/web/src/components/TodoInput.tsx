import { useState } from "react";

interface TodoInputProps {
    onAdd: (title: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
    const [value, setValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && value.trim()) {
            onAdd(value.trim());
            setValue("");
        }
    };

    return (
        <input
            className="todo-input"
            placeholder="What needs to be done?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    );
}
