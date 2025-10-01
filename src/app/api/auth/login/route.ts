import User from "@/schema/Users";
import connectMongo from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

// ----------------- login -----------------
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        await connectMongo();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: "Account not found, please sign up" },
                { status: 404 }
            );
        }

        console.log(password, user.password);

        const isPasswordCorrect = password === user.password;

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 401 }
            );
        }

        const accessToken = generateAccessToken({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userImage: user.userImage,
            },
        });
        const refreshToken = generateRefreshToken({ user: user._id });

        // Create response with access token
        const response = NextResponse.json(
            {
                message: "Login successful",
                accessToken,
            },
            { status: 200 }
        );

        // Set refresh token in HTTP-only cookie
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}



