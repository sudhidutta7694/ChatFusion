"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { Shield, ShieldCheck, ShieldPlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { UserAvatar } from "../user-avatar";

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server;
}

const roleIconMap = {
    [MemberRole.GUEST]: <Shield className="flex-shrik-0 w-5 h-5 mr-2 text-blue-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="flex-shrik-0 w-5 h-5 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldPlus className="flex-shrik-0 w-5 h-5 mr-2 text-green-500" />,
}

export const ServerMember = ({
    member,
    server,
}: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();



    return (
        <button
            onClick={() => { }}
            className={cn(
                "group py-2 px-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700")}
        >
            <UserAvatar
                className="h-8 w-8 md:h-8 md:w-8 "
                src={member.profile.image}
            />
            <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.channelId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
                {member.profile.name}
            </p>
            {roleIconMap[member.role]}
        </button>
    )
}