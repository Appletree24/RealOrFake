"use client";

import { ImageLightbox } from "@/components/image-lightbox";
import { Button } from "@/components/ui/button";
import type { SingleChoiceKey, SingleQuestion } from "@/data/daily";
import type { Language } from "@/lib/i18n";
import { copy, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type SingleImageQuestionProps = {
    question: SingleQuestion;
    selected?: SingleChoiceKey;
    revealed: boolean;
    disabled: boolean;
    language: Language;
    onSelect: (choice: SingleChoiceKey) => void;
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
    const [loaded, setLoaded] = useState(false);
    const altText = t(question.image.alt, language);

    useEffect(() => {
        setLoaded(false);
    }, [question.image.src]);

    return (
        <div className="mx-auto w-full max-w-xl">
            <div
                className={cn(
                    "relative aspect-[4/5] overflow-hidden rounded-md bg-black shadow-soft-line",
                    revealed && "ring-2 ring-ink"
                )}
            >
                {question.image.src ? (
                    <div
                        aria-hidden="true"
                        className={cn(
                            "absolute inset-0 overflow-hidden bg-stone-950 transition duration-300",
                            loaded ? "opacity-0" : "opacity-100"
                        )}
                    >
                        <Image
                            key={`${question.image.src}-placeholder`}
                            src={question.image.src}
                            alt=""
                            aria-hidden="true"
                            fill
                            quality={30}
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="scale-110 object-cover blur-2xl brightness-90 saturate-75"
                        />
                        <div className="absolute inset-0 bg-black/28" />
                    </div>
                ) : null}
                {question.image.src ? (
                    <Image
                        key={question.image.src}
                        src={question.image.src}
                        alt={altText}
                        fill
                        priority
                        quality={82}
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className={loaded ? "object-contain opacity-100 transition duration-300" : "object-contain opacity-0 transition duration-300"}
                        onLoad={() => setLoaded(true)}
                    />
                ) : (
                    <div className="relative flex h-full w-full items-center justify-center bg-stone-950/90">
                        <div className="h-10 w-10 rounded-full border-2 border-white/15" />
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
