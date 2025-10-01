"use client";

import { Eye, Link, User, Edit, Trash, Link2 } from "iconsax-reactjs";
import { useRouter } from "next/navigation";

interface CollectionCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    creator: string;
    creatorImage?: string;
    linkCount: number;
    views: number;
    onClick?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

export default function CollectionCard({
    id,
    title,
    description,
    image,
    creator,
    creatorImage,
    linkCount,
    views,
    onClick,
    onEdit,
    onDelete,
    showActions = false,
}: CollectionCardProps) {
    const router = useRouter();
    const domain = window.location.origin;

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            window.open(`/share/${id}` || `/home/${id}`, "_blank");
        }
    };

    return (
        <div
            className="h-fit bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={handleClick}
            title={`${domain}/share/${id}`}
        >
            <div className="relative h-48">
                {image ? (
                    <img
                        src={image || "/hero-page.png"}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <Link2 className=" text-blue-600" size={150} />
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold font-display mb-2">{title}</h3>
                {description ? (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {description}
                    </p>
                ) : (
                    <div className="h-1"></div>
                )}

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                            {creatorImage ? (
                                <img
                                    src={creatorImage}
                                    alt={creator}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                                    <User size="16" color="#FFFFFF" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {creator}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Link size="16" />
                            <span>{linkCount} links</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye size="16" />
                            <span>{views} views</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {showActions ? (
                            <div>
                                <button
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit?.(id);
                                    }}
                                    title="Edit"
                                >
                                    <Edit size="16" />
                                </button>
                                <button
                                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.(id);
                                    }}
                                    title="Delete"
                                >
                                    <Trash size="16" />
                                </button>
                            </div>
                        ) : (
                            <span className="text-primary font-medium">
                                View Collection →
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
