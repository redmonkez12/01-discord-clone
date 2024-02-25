import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { serverId: string }}) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return NextResponse.json({ message: "Unauthorized"}, { status: 401 });
        }

        if (!params.serverId) {
            return NextResponse.json({ message: "Server Id missing"}, { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID]", error);
        return NextResponse.json({ message: "Internal Error"}, { status: 500 });
    }
}