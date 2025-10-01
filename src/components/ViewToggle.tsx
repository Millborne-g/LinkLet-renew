"use client";

import { Grid3, Menu } from "iconsax-reactjs";

interface ViewToggleProps {
    currentView: "card" | "table";
    onViewChange: (view: "card" | "table") => void;
}

export default function ViewToggle({
    currentView,
    onViewChange,
}: ViewToggleProps) {
    return (
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
                onClick={() => onViewChange("card")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === "card"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                }`}
            >
                <Grid3 size="16" />
                <span className="hidden sm:inline">Card View</span>
            </button>
            <button
                onClick={() => onViewChange("table")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === "table"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                }`}
            >
                <Menu size="16" />
                <span className="hidden sm:inline">Table View</span>
            </button>
        </div>
    );
}
