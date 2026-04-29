"use client";

import { ImageLightbox } from "@/components/image-lightbox";
import type { ImageChoice as ImageChoiceType, PairChoiceKey } from "@/data/daily";
import type { Language } from "@/lib/i18n";
import { copy, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useState } from "react";

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

const paletteClass: Record<ImageChoiceType["palette"], string> = {
    warm:
        "from-[#d8b68d] via-[#88715e] to-[#2e2823] before:bg-[#f1d6b8]/55 after:bg-[#17110e]/35",
    cool:
        "from-[#b9c3c8] via-[#53616b] to-[#171c22] before:bg-[#e7edf0]/55 after:bg-[#101821]/35",
    neutral:
        "from-[#d0ccc4] via-[#7c776f] to-[#24211f] before:bg-[#efebe3]/50 after:bg-[#111]/30",
    green:
        "from-[#c8d0bb] via-[#66765f] to-[#1f2c24] before:bg-[#e6eadb]/50 after:bg-[#0f1c15]/35",
    rose:
        "from-[#dfb5a8] via-[#93675f] to-[#2b2020] before:bg-[#f3d4c9]/50 after:bg-[#201212]/30"
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

    const stateClass =
        revealed && correct
            ? "ring-2 ring-ink"
            : revealed && selected
                ? "opacity-55"
                : selected
                    ? "ring-2 ring-accent"
                    : "hover:-translate-y-0.5 hover:shadow-soft-line";

    const altText = t(choice.alt, language);

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
                        <Image
                            src={choice.src}
                            alt={altText}
                            fill
                            priority
                            quality={82}
                            sizes="(min-width: 1024px) 32vw, 46vw"
                            className="object-contain transition duration-500 group-hover:scale-[1.015]"
                        />
                    ) : (
                        <div
                            className={cn(
                                "relative h-full w-full bg-gradient-to-br",
                                "before:absolute before:left-[12%] before:top-[12%] before:h-[42%] before:w-[48%] before:rounded-full before:blur-2xl",
                                "after:absolute after:bottom-[10%] after:right-[8%] after:h-[36%] after:w-[42%] after:rounded-full after:blur-2xl",
                                paletteClass[choice.palette]
                            )}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                            <div className="absolute left-[14%] top-[20%] h-[42%] w-[58%] border border-white/20 bg-white/10 backdrop-blur-[1px]" />
                            <div className="absolute bottom-[18%] right-[14%] h-[18%] w-[38%] border border-white/15 bg-black/10" />
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
