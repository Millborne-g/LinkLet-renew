import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Template from "@/schema/Templates";

export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Get all templates
        const templates = await Template.find({}).sort({ name: 1 });

        return NextResponse.json({
            success: true,
            data: templates,
            count: templates.length,
        });
    } catch (error) {
        console.error("Error fetching templates:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch templates",
            },
            { status: 500 }
        );
    }
}
