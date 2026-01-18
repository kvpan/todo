import { useState } from "react";
import { Input } from "@/components/ui/input";

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
        <Input
            placeholder="What needs to be done?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-lg"
        />
    );
}
