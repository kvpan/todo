export type FilterType = "all" | "active" | "completed";

interface TodoFiltersProps {
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    activeCount: number;
}

export function TodoFilters({ filter, onFilterChange, activeCount }: TodoFiltersProps) {
    return (
        <div className="todo-filters">
            <span>{activeCount} items left</span>
            <div className="filter-buttons">
                <button
                    className={`filter-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => onFilterChange("all")}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${filter === "active" ? "active" : ""}`}
                    onClick={() => onFilterChange("active")}
                >
                    Active
                </button>
                <button
                    className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                    onClick={() => onFilterChange("completed")}
                >
                    Completed
                </button>
            </div>
        </div>
    );
}
