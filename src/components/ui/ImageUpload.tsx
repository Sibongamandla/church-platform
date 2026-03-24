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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function compressImage(file: File): Promise<File | Blob> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 1920; // Reasonable HD width
                const MAX_HEIGHT = 1080;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            resolve(file);
                        }
                    },
                    "image/jpeg",
                    0.8 // 80% quality
                );
            };
        };
    });
}

export function ImageUpload({ value, onChange, placeholder = "Upload image", className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert("File is too large. Please select an image smaller than 10MB.");
            return;
        }

        setIsUploading(true);

        try {
            // Compress if it's a large image
            if (file.size > 1 * 1024 * 1024) { // > 1MB
                const compressedBlob = await compressImage(file);
                file = new File([compressedBlob], file.name, { type: "image/jpeg" });
            }

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 413) {
                    throw new Error("File is too large for the server. Please try a smaller image.");
                }
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onChange(data.url);
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(error.message || "Failed to upload image. Please try again.");
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
