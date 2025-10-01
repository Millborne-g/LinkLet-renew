import Url from "@/schema/Urls";
import { NextRequest, NextResponse } from "next/server";
import ExternalUrl from "@/schema/ExternalUrl";
import User from "@/schema/Users";
import connectMongo from "@/lib/mongodb";
import { verifyAccessToken } from "@/lib/jwt";

// get collections for landing page
export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Find the administrator user
        const adminUser = await User.findOne({
            email: "administrator1@linklet.com",
        });
        if (!adminUser) {
            return NextResponse.json(
                { message: "Administrator user not found" },
                { status: 404 }
            );
        }

        // Get all URLs created by the administrator
        const urls = await Url.find({ userId: adminUser._id.toString() });

        if (!urls || urls.length === 0) {
            return NextResponse.json(
                { message: "No URLs found for administrator" },
                { status: 404 }
            );
        }

        // Process each URL to add createdBy information and stored link count
        const urlsWithCreatedBy = await Promise.all(
            urls.map(async (url) => {
                // Use userAlias if available, otherwise fall back to admin user info
                const createdBy = {
                    fullName:
                        url.userAlias?.name ||
                        adminUser.firstName + " " + adminUser.lastName,
                    userImage:
                        url.userAlias?.imageFile || adminUser.userImage || null,
                };

                // Count stored links (ExternalUrls) for this collection
                const storedLinkCount = await ExternalUrl.countDocuments({
                    urlParentId: url._id.toString(),
                });

                return {
                    ...url.toObject(),
                    createdBy,
                    storedLinkCount,
                };
            })
        );

        return NextResponse.json({
            urls: urlsWithCreatedBy,
            count: urlsWithCreatedBy.length,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error fetching URLs", error },
            { status: 500 }
        );
    }
}
