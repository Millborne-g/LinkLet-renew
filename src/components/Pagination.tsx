"use client";

import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface PaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    loading?: boolean;
    className?: string;
}

export default function Pagination({
    pagination,
    onPageChange,
    loading = false,
    className = "",
}: PaginationProps) {
    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    return (
        <div
            className={`bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4 ${className}`}
        >
            <nav
                className="flex flex-col sm:flex-row items-center justify-between gap-4"
                aria-label="Table navigation"
            >
                {/* Pagination Info - Responsive */}
                <div className="flex flex-col sm:flex-row items-center gap-2 order-2 sm:order-1">
                    <span className="text-xs sm:text-sm text-gray-700">
                        <span className="hidden sm:inline">Showing </span>
                        <span className="sm:hidden">Page </span>
                        <span className="font-semibold text-gray-900">
                            {pagination.page}
                        </span>
                        <span className="hidden sm:inline">
                            {" of "}
                            <span className="font-semibold text-gray-900">
                                {pagination.totalPages}
                            </span>
                            {" pages"}
                        </span>
                        <span className="sm:hidden">
                            {"/"}
                            <span className="font-semibold text-gray-900">
                                {pagination.totalPages}
                            </span>
                        </span>
                    </span>
                    <span className="hidden lg:inline text-xs sm:text-sm text-gray-500">
                        ({(pagination.page - 1) * pagination.limit + 1}-
                        {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total
                        )}{" "}
                        of {pagination.total})
                    </span>
                    <span className="sm:hidden text-xs text-gray-500">
                        {(pagination.page - 1) * pagination.limit + 1}-
                        {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total
                        )}{" "}
                        of {pagination.total}
                    </span>
                </div>

                {/* Pagination Controls - Responsive */}
                <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end">
                    {/* Previous Button */}
                    <button
                        onClick={() => onPageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrevPage || loading}
                        className="cursor-pointer flex items-center justify-center px-3 sm:px-3 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[36px] sm:min-h-[32px]"
                    >
                        <ArrowLeft2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers - Hidden on mobile, visible on tablet+ */}
                    <div className="hidden sm:flex items-center gap-1">
                        {(() => {
                            const pages = [];
                            // Responsive max visible pages - 3 on tablet, 5 on desktop
                            const maxVisiblePages = 5;
                            let startPage = Math.max(
                                1,
                                pagination.page -
                                    Math.floor(maxVisiblePages / 2)
                            );
                            let endPage = Math.min(
                                pagination.totalPages,
                                startPage + maxVisiblePages - 1
                            );

                            // Adjust start page if we're near the end
                            if (endPage - startPage + 1 < maxVisiblePages) {
                                startPage = Math.max(
                                    1,
                                    endPage - maxVisiblePages + 1
                                );
                            }

                            // Add first page and ellipsis if needed
                            if (startPage > 1) {
                                pages.push(
                                    <button
                                        key={1}
                                        onClick={() => onPageChange(1)}
                                        disabled={loading}
                                        className="cursor-pointer flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[32px]"
                                    >
                                        1
                                    </button>
                                );
                                if (startPage > 2) {
                                    pages.push(
                                        <span
                                            key="ellipsis1"
                                            className="flex items-center justify-center px-2 py-2 text-gray-500"
                                        >
                                            <span className="text-sm sm:text-lg">
                                                ⋯
                                            </span>
                                        </span>
                                    );
                                }
                            }

                            // Add visible page numbers
                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(
                                    <button
                                        key={i}
                                        onClick={() => onPageChange(i)}
                                        disabled={loading}
                                        className={`cursor-pointer flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border border-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[32px] ${
                                            i === pagination.page
                                                ? "text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                                                : "text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700"
                                        }`}
                                    >
                                        {i}
                                    </button>
                                );
                            }

                            // Add last page and ellipsis if needed
                            if (endPage < pagination.totalPages) {
                                if (endPage < pagination.totalPages - 1) {
                                    pages.push(
                                        <span
                                            key="ellipsis2"
                                            className="flex items-center justify-center px-2 py-2 text-gray-500"
                                        >
                                            <span className="text-sm sm:text-lg">
                                                ⋯
                                            </span>
                                        </span>
                                    );
                                }
                                pages.push(
                                    <button
                                        key={pagination.totalPages}
                                        onClick={() =>
                                            onPageChange(pagination.totalPages)
                                        }
                                        disabled={loading}
                                        className="cursor-pointer flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[32px]"
                                    >
                                        {pagination.totalPages}
                                    </button>
                                );
                            }

                            return pages;
                        })()}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange(pagination.page + 1)}
                        disabled={!pagination.hasNextPage || loading}
                        className="cursor-pointer flex items-center justify-center px-3 sm:px-3 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[36px] sm:min-h-[32px]"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ArrowRight2 className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
                    </button>

                    {/* Quick Page Jump - Desktop Only */}
                    <div className="hidden xl:flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
                        <span className="text-xs text-gray-500">Go to:</span>
                        <input
                            type="number"
                            min="1"
                            max={pagination.totalPages}
                            value={pagination.page}
                            onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (
                                    page >= 1 &&
                                    page <= pagination.totalPages
                                ) {
                                    onPageChange(page);
                                }
                            }}
                            className="cursor-pointer w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        />
                    </div>
                </div>
            </nav>
        </div>
    );
}
