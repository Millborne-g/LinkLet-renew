"use client";

import React from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";

interface CardPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

const CardPagination: React.FC<CardPaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    loading = false,
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getVisiblePages = () => {
        const maxVisiblePages = 5;
        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Results Info */}
                <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-600">
                    <span>
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                            {startItem}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-gray-900">
                            {endItem}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900">
                            {totalItems}
                        </span>{" "}
                        results
                    </span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                    >
                        <ArrowLeft2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {/* First page */}
                        {currentPage > 3 && (
                            <>
                                <button
                                    onClick={() => onPageChange(1)}
                                    disabled={loading}
                                    className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                                >
                                    1
                                </button>
                                {currentPage > 4 && (
                                    <span className="flex items-center justify-center w-10 h-10 text-gray-400">
                                        ⋯
                                    </span>
                                )}
                            </>
                        )}

                        {/* Visible pages */}
                        {getVisiblePages().map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                disabled={loading}
                                className={`flex items-center justify-center w-10 h-10 text-sm font-medium border rounded-lg transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                                    page === currentPage
                                        ? "text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                                        : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Last page */}
                        {currentPage < totalPages - 2 && (
                            <>
                                {currentPage < totalPages - 3 && (
                                    <span className="flex items-center justify-center w-10 h-10 text-gray-400">
                                        ⋯
                                    </span>
                                )}
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    disabled={loading}
                                    className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ArrowRight2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Quick Jump - Desktop Only */}
            <div className="hidden lg:flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">Go to page:</span>
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                            onPageChange(page);
                        }
                    }}
                    className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    disabled={loading}
                />
                <span className="text-sm text-gray-500">of {totalPages}</span>
            </div>
        </div>
    );
};

export default CardPagination;
