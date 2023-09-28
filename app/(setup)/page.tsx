// "use client"

import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-modal";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";

const SetupPage = async () => {
    const profile = await currentProfile();

    const server = await db.server.findFirst({
        where: {
            Member: {
                some: {
                    profileId: profile?.id,
                }
            }
        }
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return (
        <InitialModal/>
    );
}

export default SetupPage;