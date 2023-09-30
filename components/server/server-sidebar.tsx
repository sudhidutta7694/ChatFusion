import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@/prisma/generated/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, Shield, ShieldCheck, ShieldPlus, Video } from "lucide-react";
import { MemberRole } from "@prisma/client";

interface SeverSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
    [MemberRole.GUEST]: <Shield className="mr-2 h-4 w-4 text-blue-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldPlus className="mr-2 h-4 w-4 text-green-500" />,
}

export const ServerSidebar = async ({
    serverId
}: SeverSidebarProps) => {
    const profile = await currentProfile();

    if (!profile) return redirect('/')

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            Channel: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            Member: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                }
            }
        }
    });

    const textChannels = server?.Channel.filter((channel) => {
        return channel.type === ChannelType.TEXT
    })
    const audioChannels = server?.Channel.filter((channel) => {
        return channel.type === ChannelType.AUDIO
    })
    const videoChannels = server?.Channel.filter((channel) => {
        return channel.type === ChannelType.VIDEO
    })

    const members = server?.Member.filter((member) => {
        return member.profileId === profile.id
    })


    if (!server) return redirect('/')


    const role = server.Member.find((member) => {
        return member.profileId === profile.id
    })?.role;


    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch data={[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Voice Channels",
                            type: "channel",
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.role]
                            }))
                        },
                    ]} />
                </div>
            </ScrollArea>
        </div>
    )
}