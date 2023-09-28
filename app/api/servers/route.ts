import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/prisma/generated/client";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();
        console.log("Profile: " + profile)

        if (!profile) return new NextResponse("Unauthorized", {
            status: 401,
        })

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl: imageUrl,
                inviteCode: uuidv4(),
                Channel: {
                    create: [
                        { name: "general", profileId: profile.id }
                    ]
                },Member: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN}
                    ]

                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_POST] Error: " + error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}