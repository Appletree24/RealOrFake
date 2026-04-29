"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

type HomepageBackgroundProps = {
    imageSources: string[];
};

const LANES = [
    { direction: "left", durationClass: "animate-homepage-drift-slow", offsetClass: "-translate-x-24" },
    { direction: "right", durationClass: "animate-homepage-drift-reverse", offsetClass: "-translate-x-10" },
    { direction: "left", durationClass: "animate-homepage-drift-medium", offsetClass: "-translate-x-32" }
] as const;

function buildLaneImages(imageSources: string[], multiplier = 3) {
    return Array.from({ length: multiplier }, () => imageSources).flat();
}

export function HomepageBackground({ imageSources }: HomepageBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sources = useMemo(() => {
        const unique = Array.from(new Set(imageSources.filter(Boolean)));
        if (unique.length === 0) return [];
        return unique;
    }, [imageSources]);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const coarsePointer = window.matchMedia("(pointer: coarse)");

        if (reducedMotion.matches || coarsePointer.matches) {
            element.style.setProperty("--parallax-x", "0px");
            element.style.setProperty("--parallax-y", "0px");
            return;
        }

        let frameId = 0;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const render = () => {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            element.style.setProperty("--parallax-x", `${currentX.toFixed(2)}px`);
            element.style.setProperty("--parallax-y", `${currentY.toFixed(2)}px`);

            if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
                frameId = window.requestAnimationFrame(render);
            } else {
                frameId = 0;
            }
        };

        const handlePointerMove = (event: PointerEvent) => {
            const offsetX = event.clientX / window.innerWidth - 0.5;
            const offsetY = event.clientY / window.innerHeight - 0.5;
            targetX = offsetX * 52;
            targetY = offsetY * 34;

            if (!frameId) {
                frameId = window.requestAnimationFrame(render);
            }
        };

        const reset = () => {
            targetX = 0;
            targetY = 0;
            if (!frameId) {
                frameId = window.requestAnimationFrame(render);
            }
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("blur", reset);

        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("blur", reset);
        };
    }, []);

    if (sources.length === 0) return null;

    const laneImages = buildLaneImages(sources);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            ref={containerRef}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_32%),linear-gradient(180deg,rgba(251,248,242,0.9),rgba(245,241,234,0.86)_48%,rgba(238,232,220,0.92))]" />
            <div
                className="absolute inset-y-[-12%] left-1/2 w-[145%] -translate-x-1/2 -rotate-12"
                style={{
                    transform:
                        "translate3d(calc(-50% + (var(--parallax-x, 0px) * -0.2)), calc(var(--parallax-y, 0px) * -0.14), 0) rotate(-12deg)"
                }}
            >
                <div className="flex h-full flex-col justify-center gap-6 md:gap-8 xl:gap-10">
                    {LANES.map((lane, laneIndex) => (
                        <div
                            className={`flex w-max gap-4 md:gap-5 ${lane.durationClass} ${lane.offsetClass}`}
                            key={`${lane.direction}-${laneIndex}`}
                            style={{
                                transform: `translate3d(calc(var(--parallax-x, 0px) * ${
                                    laneIndex === 0 ? -0.2 : laneIndex === 1 ? 0.12 : 0.28
                                }), calc(var(--parallax-y, 0px) * ${
                                    laneIndex === 0 ? -0.24 : laneIndex === 1 ? 0.16 : 0.34
                                }), 0)`
                            }}
                        >
                            {laneImages.map((src, imageIndex) => (
                                <div
                                    className="relative h-28 w-44 shrink-0 overflow-hidden rounded-2xl border border-white/35 bg-white/25 shadow-[0_18px_40px_rgba(17,17,17,0.10)] backdrop-blur-[2px] md:h-32 md:w-52 xl:h-40 xl:w-64"
                                    key={`${laneIndex}-${src}-${imageIndex}`}
                                >
                                    <Image
                                        alt=""
                                        className="object-cover saturate-[0.88]"
                                        fill
                                        loading="lazy"
                                        sizes="(min-width: 1280px) 256px, (min-width: 768px) 208px, 176px"
                                        src={src}
                                    />
                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(17,17,17,0.20))]" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,241,234,0.96),rgba(245,241,234,0.78)_28%,rgba(245,241,234,0.50)_50%,rgba(245,241,234,0.78)_72%,rgba(245,241,234,0.96))]" />
        </div>
    );
}
