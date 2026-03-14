"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    placeholder?: string;
    className?: string;
}

export function ImageUpload({ value, onChange, placeholder = "Upload image", className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            onChange(data.url);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const clearImage = () => {
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={cn(
                    "relative aspect-video rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group",
                    value && "border-none",
                    isUploading && "cursor-not-allowed opacity-70"
                )}
            >
                {value ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={value} 
                            alt="Uploaded" 
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); clearImage(); }}
                            className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-md rounded-full shadow-sm hover:bg-background transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 p-6">
                        {isUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        ) : (
                            <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                            {isUploading ? "Uploading..." : placeholder}
                        </p>
                    </div>
                )}
            </div>
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}
