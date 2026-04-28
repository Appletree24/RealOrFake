"use client";

import { ImageLightbox } from "@/components/image-lightbox";
import { Button } from "@/components/ui/button";
import type { SingleChoiceKey, SingleQuestion } from "@/data/daily";
import type { Language } from "@/lib/i18n";
import { copy, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";
import { useState } from "react";

type SingleImageQuestionProps = {
    question: SingleQuestion;
    selected?: SingleChoiceKey;
    revealed: boolean;
    disabled: boolean;
    language: Language;
    onSelect: (choice: SingleChoiceKey) => void;
};

const paletteClass: Record<SingleQuestion["image"]["palette"], string> = {
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

export function SingleImageQuestion({
    question,
    selected,
    revealed,
    disabled,
    language,
    onSelect
}: SingleImageQuestionProps) {
    const c = copy[language];
    const correctChoice = question.aiAnswer ? "ai" : "real";
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const altText = t(question.image.alt, language);

    return (
        <div className="mx-auto w-full max-w-xl">
            <div
                className={cn(
                    "relative aspect-[4/5] overflow-hidden rounded-md bg-black shadow-soft-line",
                    revealed && "ring-2 ring-ink"
                )}
            >
                {question.image.src ? (
                    <img
                        alt={altText}
                        className="h-full w-full object-contain"
                        src={question.image.src}
                    />
                ) : (
                    <div
                        className={cn(
                            "relative h-full w-full bg-gradient-to-br",
                            "before:absolute before:left-[12%] before:top-[12%] before:h-[42%] before:w-[48%] before:rounded-full before:blur-2xl",
                            "after:absolute after:bottom-[10%] after:right-[8%] after:h-[36%] after:w-[42%] after:rounded-full after:blur-2xl",
                            paletteClass[question.image.palette]
                        )}
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                        <div className="absolute left-[16%] top-[16%] h-[46%] w-[62%] border border-white/20 bg-white/10 backdrop-blur-[1px]" />
                        <div className="absolute bottom-[16%] right-[14%] h-[16%] w-[42%] border border-white/15 bg-black/10" />
                    </div>
                )}

                {question.image.src ? (
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        aria-label={c.zoomIn}
                        title={c.zoomIn}
                        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </button>
                ) : null}

                {revealed ? (
                    <span className="absolute bottom-4 left-4 rounded-full bg-paper px-3 py-1 text-sm font-medium text-ink">
                        {question.aiAnswer ? c.revealedAI : c.revealedReal}
                    </span>
                ) : null}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                    className="px-2"
                    disabled={disabled}
                    onClick={() => onSelect("ai")}
                    size="lg"
                    type="button"
                    variant={selected === "ai" || (revealed && correctChoice === "ai") ? "primary" : "secondary"}
                >
                    {c.chooseAI}
                </Button>
                <Button
                    className="px-2"
                    disabled={disabled}
                    onClick={() => onSelect("real")}
                    size="lg"
                    type="button"
                    variant={selected === "real" || (revealed && correctChoice === "real") ? "primary" : "secondary"}
                >
                    {c.chooseReal}
                </Button>
            </div>

            {question.image.src ? (
                <ImageLightbox
                    open={lightboxOpen}
                    src={question.image.src}
                    alt={altText}
                    closeLabel={c.closePreview}
                    onClose={() => setLightboxOpen(false)}
                />
            ) : null}
        </div>
    );
}
