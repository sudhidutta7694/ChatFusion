import { useEffect, useState } from "react";

type ChatscrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    loadMore: () => void;
    shouldLoadMore: boolean;
    count: number;
};


export const useChatScroll = ({
    chatRef,
    bottomRef,
    loadMore,
    shouldLoadMore,
    count,
}: ChatscrollProps) => {
    const [hasInitialised, setHasInitialised] = useState(false);
    useEffect(() => {
        const topDiv = chatRef.current;
        const handleScroll = () => {
            if (topDiv) {
                if (topDiv.scrollTop === 0 && shouldLoadMore) {
                    loadMore();
                }
            }
        };

        topDiv?.addEventListener("scroll", handleScroll);
        return () => {
            topDiv?.removeEventListener("scroll", handleScroll);
        }
    }, [chatRef, loadMore, shouldLoadMore]);

    useEffect(() => {
        const bottomDiv = bottomRef.current;
        const topDiv = chatRef.current;
        const shouldAutoScroll = () => {
            if (!hasInitialised && bottomDiv) {
                bottomDiv.scrollIntoView({ behavior: "smooth" });
                setHasInitialised(true);
                return true;
            }

            if (!topDiv) {
                return false;
            }

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 100;
        }

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomDiv?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [count, bottomRef, hasInitialised]);
}