import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface memberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    },
    searchParams: {
        video?: boolean;
    }
}
const MemberIdPage = async ({
    params,
    searchParams
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

    const otherMember = memberOne.profileId !== profile.id ? memberOne : memberTwo;
    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={params.serverId}
                type="conversation"
            />
            {searchParams.video && (
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                >
                </MediaRoom>
            )}
            {!searchParams.video && (
                <>
                    <ChatMessages
                        name={otherMember.profile.name}
                        member={currentmember}
                        chatId={conversation.id}
                        apiUrl={'/api/direct-messages'}
                        socketUrl={'/api/socket/direct-messages'}
                        paramKey={"conversationId"}
                        paramValue={conversation.id}
                        socketQuery={{
                            conversationId: conversation.id
                        }}
                        type={"conversation"}
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        apiUrl={'/api/socket/direct-messages'}
                        query={{
                            conversationId: conversation.id
                        }}
                        type={"conversation"}
                    />
                </>
            )}
        </div>

    );
}

export default MemberIdPage;