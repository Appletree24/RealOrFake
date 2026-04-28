"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CategoryDefinition, CategoryId } from "@/data/daily";
import type { Language } from "@/lib/i18n";
import { copy, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
    Building2,
    Camera,
    Car,
    Cat,
    GraduationCap,
    Heart,
    Home,
    Landmark,
    Lock,
    Mic,
    Music,
    Shirt,
    ShoppingBag,
    Sparkles,
    Utensils,
    WandSparkles
} from "lucide-react";

type CategoryShowcaseProps = {
    categories: CategoryDefinition[];
    activeCategory: CategoryId;
    language: Language;
    onSelect: (category: CategoryId) => void;
    onStart: () => void;
};

const icons = {
    all: Camera,
    "y2k-ccd": Camera,
    childhood: Home,
    "dorm-life": Home,
    concert: WandSparkles,
    "ita-bag": ShoppingBag,
    "photo-booth": Camera,
    "local-food": Utensils,
    minsu: Building2,
    "kpop-fanmeet": Mic,
    wedding: Heart,
    esports: Sparkles,
    museum: Landmark,
    "street-fashion": Shirt,
    "temple-fair": Music,
    graduation: GraduationCap,
    "pet-cafe": Cat,
    "auto-show": Car
} satisfies Record<CategoryId, typeof Camera>;

const accentClass: Record<CategoryDefinition["accent"], string> = {
    warm: "bg-[#d8b68d]",
    cool: "bg-[#b9c3c8]",
    neutral: "bg-[#d0ccc4]",
    green: "bg-[#c8d0bb]",
    rose: "bg-[#dfb5a8]"
};

export function CategoryShowcase({
    categories,
    activeCategory,
    language,
    onSelect,
    onStart
}: CategoryShowcaseProps) {
    const c = copy[language];
    const active = categories.find((category) => category.id === activeCategory) ?? categories[0];
    const isActiveLocked = Boolean(active.locked);
    const animated = [...categories, ...categories];

    return (
        <section className="grid min-h-[calc(100svh-5.5rem)] gap-8 py-8 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="animate-quiet-rise max-w-2xl">
                <Badge>{c.truthKicker}</Badge>
                <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-ink sm:mt-6 sm:text-6xl sm:leading-[1.04]">
                    {c.truthHeadline}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:mt-6 sm:text-lg sm:leading-8">
                    {c.truthBody}
                </p>

                <div className="mt-8 border-y border-line py-5">
                    <p className="text-sm text-muted">{c.selectedScene}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <p className="text-2xl font-semibold text-ink">{t(active.label, language)}</p>
                        <Badge className="normal-case">
                            {active.locked === "pro"
                                ? c.proOnly
                                : active.locked === "soon"
                                    ? c.comingSoon
                                    : c.freshPick}
                        </Badge>
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                        {isActiveLocked && active.unlockHint
                            ? t(active.unlockHint, language)
                            : isActiveLocked
                                ? c.lockedHint
                                : t(active.tagline, language)}
                    </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                    <Button
                        className="w-full sm:w-auto"
                        onClick={onStart}
                        size="lg"
                        disabled={isActiveLocked}
                    >
                        {c.startChallenge}
                    </Button>
                    <Button
                        className="w-full sm:w-auto"
                        onClick={() => onSelect("all")}
                        size="lg"
                        variant="secondary"
                    >
                        {t(categories[0].label, language)}
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-ink">{c.chooseCategory}</p>
                    <p className="text-sm text-muted">{c.newDrop}</p>
                </div>

                <div className="relative overflow-hidden border-y border-line py-4">
                    <div className="flex w-max gap-3 animate-category-drift">
                        {animated.map((category, index) => {
                            const Icon = icons[category.id];
                            const locked = Boolean(category.locked);
                            const lockLabel =
                                category.locked === "pro"
                                    ? c.proOnly
                                    : category.locked === "soon"
                                        ? c.comingSoon
                                        : null;
                            return (
                                <button
                                    aria-pressed={activeCategory === category.id}
                                    className={cn(
                                        "flex h-24 w-40 shrink-0 flex-col justify-between rounded-md border p-4 text-left transition sm:w-44",
                                        activeCategory === category.id
                                            ? "border-ink bg-white/80 shadow-soft-line"
                                            : "border-line bg-white/35 hover:bg-white/65",
                                        locked && "opacity-70"
                                    )}
                                    key={`${category.id}-${index}`}
                                    onClick={() => onSelect(category.id)}
                                    type="button"
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-full",
                                                accentClass[category.accent]
                                            )}
                                        >
                                            <Icon className="h-4 w-4 text-ink" />
                                        </span>
                                        {locked ? (
                                            <Lock className="h-3.5 w-3.5 text-muted" />
                                        ) : null}
                                    </div>
                                    <span className="text-sm font-semibold text-ink">
                                        {t(category.label, language)}
                                    </span>
                                    {lockLabel ? (
                                        <span className="text-[10px] uppercase tracking-wide text-muted">
                                            {lockLabel}
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {categories.map((category) => {
                        const Icon = icons[category.id];
                        const locked = Boolean(category.locked);
                        const lockLabel =
                            category.locked === "pro"
                                ? c.proOnly
                                : category.locked === "soon"
                                    ? c.comingSoon
                                    : null;
                        return (
                            <button
                                className={cn(
                                    "flex items-center justify-between rounded-md border px-3 py-3 text-left transition",
                                    activeCategory === category.id
                                        ? "border-ink bg-white/80"
                                        : "border-line bg-white/35 hover:bg-white/65",
                                    locked && "opacity-70"
                                )}
                                key={category.id}
                                onClick={() => onSelect(category.id)}
                                type="button"
                            >
                                <span className="flex min-w-0 items-center gap-3">
                                    <Icon className="h-4 w-4 shrink-0 text-muted" />
                                    <span className="truncate text-sm font-medium text-ink">
                                        {t(category.label, language)}
                                    </span>
                                </span>
                                {lockLabel ? (
                                    <span className="ml-3 flex items-center gap-1 text-xs uppercase tracking-wide text-muted">
                                        <Lock className="h-3 w-3" />
                                        {lockLabel}
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
