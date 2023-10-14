"use client"

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css"

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage"
}

export const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    const fileType = value.split('.').pop();

    if (value && fileType != "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    sizes="(max-width: 48px) 100vw, 48px"
                    alt="Upload"
                    className="rounded-full"
                />
                <Button
                    onClick={() => onChange("")}
                    className="bg-rose-600 text-white  rounded-full absolute top-[-0.75rem] right-[-0.75rem] shadow-sm h-12 scale-50"
                    type="button">
                    <X className="h-8 w-4 scale-150" />
                </Button>
            </div>
        )
    }

    else if (value && fileType=="pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon
                    className="h-10 w-10 fill-indigo-200 stroke-indigo-200"
                >
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener norefferer"
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                    >
                        {value}
                    </a>
                    <Button
                        onClick={() => onChange("")}
                        className="bg-rose-600 text-white  rounded-full absolute top-[-0.75rem] right-[-0.75rem] shadow-sm h-12 scale-50"
                        type="button">
                        <X className="h-8 w-4 scale-150" />
                    </Button>
                </FileIcon>

            </div>
        )
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={res => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                console.error(error);
            }}
        />
    )
}