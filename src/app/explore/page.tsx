"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    SearchNormal1,
    Filter,
    Grid3,
    Menu,
    Add,
    Discover,
} from "iconsax-reactjs";
import { motion } from "framer-motion";
import CollectionCard from "@/components/CollectionCard";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/Button";
import { useUrlStore } from "@/store/UrlStore";
import CustomButton from "@/components/CustomButton";
import Pagination from "@/components/Pagination";
import TextField from "@/components/TextField";

interface ExploreUrl {
    id: string;
    title: string;
    description: string;
    image: string;
    views: number;
    createdAt: string;
    updatedAt: string;
    template: any;
    userAlias: any;
    linkCount: number;
    creator: string;
    creatorImage: string | null;
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export default function ExplorePage() {
    const router = useRouter();
    const { accessToken } = useAuthStore();
    const [urls, setUrls] = useState<ExploreUrl[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const { setUrlPreviewMode, setUrlTemplate } = useUrlStore();
    const fetchUrls = async (page = 1, search = "") => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "12",
                ...(search && { search }),
            });

            const response = await api.get(`/api/explore?${params}`);

            setUrls(response.data.urls);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Error fetching explorable URLs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrls(currentPage, searchQuery);
    }, [currentPage, searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchUrls(1, searchQuery);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleUrlClick = (id: string) => {
        window.open(`/share/${id}`, "_blank");
    };

    useEffect(() => {
        if (setUrlPreviewMode) {
            setUrlPreviewMode(false);
            setUrlTemplate(null);
        }
    }, [setUrlPreviewMode, setUrlTemplate]);

    return (
        <div className="min-h-screen bg-white px-3">
            <div
                className={`lg:max-w-[60rem] xl:max-w-[76rem] mx-auto py-5 h-full ${
                    accessToken ? "pt-0" : "pt-20"
                }`}
            >
                {/* Enhanced Header */}
                <div className="relative ">
                    <div className="relative border-b border-gray-200/50  py-6 sm:py-8">
                        <div className="max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                            >
                                {/* Title Section */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Discover
                                                size="24"
                                                className="text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <motion.h1
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.6,
                                                delay: 0.1,
                                            }}
                                            className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
                                        >
                                            Explore Collections
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.6,
                                                delay: 0.2,
                                            }}
                                            className="text-gray-600 mt-2 text-lg leading-relaxed"
                                        >
                                            Discover amazing link collections
                                            shared by our creative community
                                        </motion.p>
                                    </div>
                                </div>

                                {/* Action Button */}
                                {accessToken && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.4,
                                        }}
                                        className="flex-shrink-0"
                                    >
                                        {/* <Button
                                        onClick={() =>
                                            router.push("/home/create")
                                        }
                                        text="Create Collection"
                                        variant="primary"
                                        rounded="lg"
                                        size="lg"
                                        width="auto"
                                        className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    /> */}
                                        <CustomButton
                                            text="Create Collection"
                                            icon={<Add className="w-5 h-5" />}
                                            onClick={() => {
                                                router.push("/home/create");
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="max-w-7xl mx-auto  py-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 flex">
                            <TextField
                                type="search"
                                placeholder="Search collections..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                width="full"
                                startIcon={
                                    <SearchNormal1 className="w-5 h-5" />
                                }
                                // className="w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </form>

                        {/* View Mode Toggle */}
                        {/* <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                <Grid3 size="20" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === "list"
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                <Menu size="20" />
                            </button>
                        </div> */}
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : urls.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <SearchNormal1 size="48" className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No collections found
                            </h3>
                            <p className="text-gray-600">
                                {searchQuery
                                    ? "Try adjusting your search terms"
                                    : "Be the first to share a collection!"}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            {/* <div className="mb-6">
                            <p className="text-gray-600">
                                {pagination?.total} collection
                                {pagination?.total !== 1 ? "s" : ""} found
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                        </div> */}

                            {/* Collections Grid */}
                            <div
                                className={`grid gap-6 ${
                                    viewMode === "grid"
                                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 "
                                        : "grid-cols-1"
                                }`}
                            >
                                {urls.map((url, index) => (
                                    <motion.div
                                        key={url.id}
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                            scale: 0.9,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.3,
                                            ease: "easeOut",
                                        }}
                                    >
                                        <CollectionCard
                                            id={url.id}
                                            title={url.title}
                                            description={url.description}
                                            image={url.image}
                                            creator={url.creator}
                                            creatorImage={
                                                url.creatorImage || ""
                                            }
                                            linkCount={url.linkCount}
                                            views={url.views}
                                            onClick={() =>
                                                handleUrlClick(url.id)
                                            }
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && (
                                <Pagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                    loading={loading}
                                    className="mt-8 bg-white"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
