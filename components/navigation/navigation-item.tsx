"use client"

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
};

export const NavigationItem = ({
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${id}`)
    }
    return (
        <ActionTooltip
            label={name}
            align="center"
            side="right">
            <button
                onClick={onClick}
                className="group relative flex items-center"
            >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]",
                )} />
                <div className={cn(
                    "group relative flex mx-3 my-[14px]  h-[48px] w-[48px] rounded-[24px] brightness-[0.85]     group-hover:brightness-95  group-hover:rounded-[20px] transition-all overflow-hidden",
                    params?.serverId === id && "brightness-100 group-hover:brightness-100 bg-primary-10 text-primary group-hover:rounded-[16px] rounded-[16px]",
                )}>
                    <Image
                        fill
                        sizes="(max-width: 48px) 100vw, 48px"
                        src={imageUrl}
                        alt="Channel"
                    />

                </div>
            </button>


        </ActionTooltip>
    )
}
