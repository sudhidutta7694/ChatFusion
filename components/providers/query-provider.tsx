"use client";

import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query"
import { useState } from "react";

export const QueryProvider = ({
    children
}:{
    children: React.ReactNode
}) => {
    const [queryClient, setQueryClient]= useState();
    
    return (
        <div className="">
            
        </div>
    )
}