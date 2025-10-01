import { NextRequest, NextResponse } from "next/server";
import User from "@/schema/Users";
import connectMongo from "@/lib/mongodb";

export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Count total active users
        const userCount = await User.countDocuments({ isActive: true });

        // Only return the count if it's more than 50
        if (userCount > 50) {
            return NextResponse.json({ count: userCount });
        } else {
            return NextResponse.json({ count: null });
        }
    } catch (error) {
        console.error("Error fetching user count:", error);
        return NextResponse.json(
            { message: "Error fetching user count" },
            { status: 500 }
        );
    }
}
