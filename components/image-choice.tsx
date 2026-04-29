"use client";

import { ImageLightbox } from "@/components/image-lightbox";
import type { ImageChoice as ImageChoiceType, PairChoiceKey } from "@/data/daily";
import type { Language } from "@/lib/i18n";
import { copy, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";

type ImageChoiceProps = {
    choice: ImageChoiceType;
    label: "A" | "B";
    selected: boolean;
    revealed: boolean;
    correct: boolean;
    disabled: boolean;
    language: Language;
    onSelect: (choice: PairChoiceKey) => void;
};

export function ImageChoice({
    choice,
    label,
    selected,
    revealed,
    correct,
    disabled,
    language,
    onSelect
}: ImageChoiceProps) {
    const c = copy[language];
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const stateClass =
        revealed && correct
            ? "ring-2 ring-ink"
            : revealed && selected
                ? "opacity-55"
                : selected
                    ? "ring-2 ring-accent"
                    : "hover:-translate-y-0.5 hover:shadow-soft-line";

    const altText = t(choice.alt, language);

    useEffect(() => {
        setLoaded(false);
    }, [choice.src]);

    return (
        <>
            <div
                className={cn(
                    "group relative aspect-[4/5] w-full overflow-hidden rounded-md bg-black text-left transition duration-300",
                    stateClass
                )}
            >
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(choice.key)}
                    aria-pressed={selected}
                    aria-label={altText}
                    className={cn(
                        "absolute inset-0 h-full w-full cursor-pointer",
                        "relative",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
                        "disabled:cursor-default"
                    )}
                >
                    {choice.src ? (
                        <div
                            aria-hidden="true"
                            className={cn(
                                "absolute inset-0 flex items-center justify-center bg-stone-950/90 transition duration-300",
                                loaded ? "opacity-0" : "opacity-100"
                            )}
                        >
                            <div className="h-10 w-10 animate-pulse rounded-full border-2 border-white/20 border-t-white/70" />
                        </div>
                    ) : null}
                    {choice.src ? (
                        <Image
                            key={choice.src}
                            src={choice.src}
                            alt={altText}
                            fill
                            priority
                            quality={82}
                            sizes="(min-width: 1024px) 32vw, 46vw"
                            className={cn(
                                "object-contain transition duration-500 group-hover:scale-[1.015]",
                                loaded ? "opacity-100" : "opacity-0"
                            )}
                            onLoad={() => setLoaded(true)}
                        />
                    ) : (
                        <div className="relative flex h-full w-full items-center justify-center bg-stone-950/90">
                            <div className="h-10 w-10 rounded-full border-2 border-white/15" />
                        </div>
                    )}
                </button>

                <span className="pointer-events-none absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-sm font-semibold text-ink">
                    {label}
                </span>

                {choice.src ? (
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            setLightboxOpen(true);
                        }}
                        aria-label={c.zoomIn}
                        title={c.zoomIn}
                        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </button>
                ) : null}

                {revealed && correct ? (
                    <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-paper px-3 py-1 text-sm font-medium text-ink">
                        {c.revealedAI}
                    </span>
                ) : null}
            </div>

            {choice.src ? (
                <ImageLightbox
                    open={lightboxOpen}
                    src={choice.src}
                    alt={altText}
                    closeLabel={c.closePreview}
                    onClose={() => setLightboxOpen(false)}
                />
            ) : null}
        </>
    );
}
