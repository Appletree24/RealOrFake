"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";

type ImageLightboxProps = {
    open: boolean;
    src: string;
    alt: string;
    closeLabel: string;
    onClose: () => void;
};

export function ImageLightbox({ open, src, alt, closeLabel, onClose }: ImageLightboxProps) {
    useEffect(() => {
        if (!open) return;

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-8 backdrop-blur-sm",
                "animate-in fade-in duration-150"
            )}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
        >
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onClose();
                }}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={closeLabel}
            >
                <X className="h-5 w-5" />
            </button>

            <div
                onClick={(event) => event.stopPropagation()}
                className="relative h-[92vh] w-[92vw]"
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    quality={90}
                    sizes="92vw"
                    className="rounded-md object-contain shadow-2xl"
                />
            </div>
        </div>
    );
}
