import { NextRequest, NextResponse } from "next/server";
import Url from "@/schema/Urls";
import ExternalUrl from "@/schema/ExternalUrl";
import connectMongo from "@/lib/mongodb";
import User from "@/schema/Users";

export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Get query parameters for pagination and filtering
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const search = searchParams.get("search") || "";

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Build query object - only get URLs that are public AND exploreByAll is true
        let query: any = {
            public: true,
            exploreByAll: true,
        };

        // Apply search filter if search term is provided
        if (search.trim()) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Get total count of explorable URLs
        const total = await Url.countDocuments(query);

        // Get paginated URLs with external URL counts
        const urls = await Url.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ views: -1, createdAt: -1 }); // Sort by views (popularity) then creation date

        // Fetch ExternalUrl count and creator info for each URL
        const urlsWithDetails = await Promise.all(
            urls.map(async (url) => {
                const externalUrlsCount = await ExternalUrl.countDocuments({
                    urlParentId: url._id.toString(),
                });

                let createdBy = null;
                if (url?.userId) {
                    const user = await User.findById(url.userId);

                    if (url.userAlias) {
                        createdBy = {
                            fullName: url.userAlias?.name,
                            userImage: url.userAlias?.imageFile,
                        };
                    } else {
                        createdBy = {
                            fullName: user?.firstName + " " + user?.lastName,
                            userImage: user?.userImage ? user?.userImage : null,
                        };
                    }
                }

                return {
                    id: url._id.toString(),
                    title: url.title,
                    description: url.description,
                    image: url.image,
                    views: url.views,
                    createdAt: url.createdAt,
                    updatedAt: url.updatedAt,
                    template: url.template,
                    userAlias: url.userAlias,
                    linkCount: externalUrlsCount,
                    // For creator info, we'll use userAlias if available, otherwise we'll need to fetch user data
                    creator: createdBy?.fullName,
                    creatorImage: createdBy?.userImage,
                };
            })
        );

        return NextResponse.json({
            urls: urlsWithDetails,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching explorable URLs:", error);
        return NextResponse.json(
            { message: "Error fetching explorable URLs" },
            { status: 500 }
        );
    }
}
