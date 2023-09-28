import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode
        }
    });

    if (existingServer) {
        // Server exists, add the user as a member
        const server = await db.server.update({
            where: {
                id: existingServer.id
            },
            data: {
                Member: {
                    create: [
                        {
                            profileId: profile.id,
                        }
                    ]
                }
            }
        });

        if (server) {
            return redirect(`/servers/${server.id}`);
        }
    } else {
        // Server doesn't exist, create a new server and add the user as a member
        const newServer = await db.server.create({
            data: {
                inviteCode: params.inviteCode, // You might want to specify other server details here
                Member: {
                    create: [
                        {
                            profileId: profile.id,
                        }
                    ]
                }
            }
        });

        if (newServer) {
            return redirect(`/servers/${newServer.id}`);
        }
    }

    // Handle the case where the operation failed
    return redirect("/");
}

export default InviteCodePage;
