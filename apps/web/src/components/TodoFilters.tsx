import { Button } from "@/components/ui/button";

export type FilterType = "all" | "active" | "completed";

interface TodoFiltersProps {
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    activeCount: number;
}

export function TodoFilters({ filter, onFilterChange, activeCount }: TodoFiltersProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm text-muted-foreground">{activeCount} items left</span>
            <div className="flex gap-2">
                <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange("all")}
                    aria-pressed={filter === "all"}
                >
                    All
                </Button>
                <Button
                    variant={filter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange("active")}
                    aria-pressed={filter === "active"}
                >
                    Active
                </Button>
                <Button
                    variant={filter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange("completed")}
                    aria-pressed={filter === "completed"}
                >
                    Completed
                </Button>
            </div>
        </div>
    );
}
