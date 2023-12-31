import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface memberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    }
}
const MemberIdPage = async ({
    params
}: memberIdPageProps) => {

    const profile = await currentProfile();

    if (!profile) return redirectToSignIn;

    const currentmember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        },
        include: {
            profile: true,
        }
    });

    // console.log(currentmember);

    if (!currentmember) return redirect("/");

    const conversation = await getOrCreateConversation(currentmember.id, params.memberId);

    if (!conversation) return redirect(`/servers/${params.serverId}`);

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne === profile.id ? memberOne : memberTwo;
    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={params.serverId}
                type="conversation"
            />
        </div>
    );
}

export default MemberIdPage;