"use client";

import { CategoryShowcase } from "@/components/category-showcase";
import { ImageChoice } from "@/components/image-choice";
import { ResultPanel } from "@/components/result-panel";
import { SingleImageQuestion } from "@/components/single-image-question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CategoryId, ChoiceKey, DailyChallenge } from "@/data/daily";
import { categoryDeck } from "@/data/daily";
import type { Language } from "@/lib/i18n";
import { copy, languageLabel, t } from "@/lib/i18n";
import {
    correctChoiceFor,
    interleaveQuestions,
    isLlmCorrect,
    mockWrongRate,
    opponentNameForChallenge,
    scoreAnswers,
    scoreLlmAnswers
} from "@/lib/quiz";
import { parseInviteFromSearch, type InviteContext } from "@/lib/share-context";
import { ArrowRight, Eye, Languages, Sparkles, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type QuizAppProps = {
    challenge: DailyChallenge;
};

export function QuizApp({ challenge }: QuizAppProps) {
    const [language, setLanguage] = useState<Language>("en");
    const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
    const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, ChoiceKey>>({});
    const [revealed, setRevealed] = useState(false);
    const [invite, setInvite] = useState<InviteContext | null>(null);
    const quizRef = useRef<HTMLElement>(null);
    const c = copy[language];
    const playableCategories = useMemo(() => {
        const ids = new Set<CategoryId>(["all"]);
        for (const question of challenge.questions) {
            ids.add(question.categoryId);
        }
        return ids;
    }, [challenge.questions]);
    const visibleCategories = useMemo(
        () =>
            categoryDeck.filter(
                (category) => category.id === "all" || category.locked || playableCategories.has(category.id)
            ),
        [playableCategories]
    );

    const questions = useMemo(() => {
        const filtered =
            activeCategory === "all"
                ? challenge.questions
                : challenge.questions.filter((question) => question.categoryId === activeCategory);
        return interleaveQuestions(filtered, `${challenge.day}-${activeCategory}`);
    }, [activeCategory, challenge.questions, challenge.day]);
    const activeChallenge = useMemo(
        () => ({ ...challenge, questions }),
        [challenge, questions]
    );
    const question = questions[index];
    const wrongRate = question ? mockWrongRate(question.id) : 0;
    const selected = question ? answers[question.id] : undefined;
    const score = useMemo(
        () => scoreAnswers(questions, answers),
        [answers, questions]
    );
    const llmScore = useMemo(() => scoreLlmAnswers(questions), [questions]);
    const opponentName = useMemo(
        () => opponentNameForChallenge(challenge, activeCategory),
        [activeCategory, challenge]
    );
    const progress = ((index + (revealed ? 1 : 0)) / questions.length) * 100;

    useEffect(() => {
        const saved = window.localStorage.getItem("ai-photo-language");
        if (saved === "en" || saved === "zh") {
            setLanguage(saved);
            return;
        }

        if (navigator.language.toLowerCase().startsWith("zh")) {
            setLanguage("zh");
        }
    }, []);

    useEffect(() => {
        const parsed = parseInviteFromSearch(window.location.search);
        if (!parsed) return;
        setInvite(parsed);
        if (parsed.category) {
            const target = visibleCategories.find((item) => item.id === parsed.category);
            if (target && !target.locked && playableCategories.has(target.id)) {
                setActiveCategory(target.id);
                setIndex(0);
                setAnswers({});
                setRevealed(false);
                setPhase("playing");
            }
        }
    }, [playableCategories, visibleCategories]);

    useEffect(() => {
        if (!visibleCategories.some((category) => category.id === activeCategory)) {
            setActiveCategory("all");
        }
    }, [activeCategory, visibleCategories]);

    function toggleLanguage() {
        const nextLanguage = language === "en" ? "zh" : "en";
        setLanguage(nextLanguage);
        window.localStorage.setItem("ai-photo-language", nextLanguage);
    }

    function resetRun() {
        setIndex(0);
        setAnswers({});
        setRevealed(false);
        setPhase("intro");
    }

    function selectCategory(category: CategoryId) {
        const target = visibleCategories.find((item) => item.id === category);
        if (!target || target.locked) return;
        setActiveCategory(category);
        setIndex(0);
        setAnswers({});
        setRevealed(false);
    }

    function startChallenge() {
        if (questions.length === 0) return;
        setIndex(0);
        setAnswers({});
        setRevealed(false);
        setPhase("playing");
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        });
    }

    function select(choice: ChoiceKey) {
        if (revealed || !question) return;
        setAnswers((current) => ({ ...current, [question.id]: choice }));
        setRevealed(true);
    }

    function next() {
        if (index === questions.length - 1) {
            setPhase("done");
            return;
        }

        setIndex((current) => current + 1);
        setRevealed(false);
    }

    function restart() {
        resetRun();
    }

    if (phase === "done") {
        return (
            <ResultPanel
                challenge={activeChallenge}
                score={score}
                llmScore={llmScore}
                opponentName={opponentName}
                category={activeCategory}
                language={language}
                onRestart={restart}
            />
        );
    }

    const correctChoice = question ? correctChoiceFor(question) : undefined;
    const selectedCorrect = selected === correctChoice;
    const llmCorrect = question ? isLlmCorrect(question) : false;
    const llmReason = question ? t(question.llmExplanation, language) : "";

    const inviteBanner = invite ? (
        <div className="mt-2 flex items-start gap-3 rounded-md border border-line bg-white/55 px-4 py-3 shadow-soft-line sm:items-center">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent sm:mt-0">
                <Trophy className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {c.inviteBannerKicker}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-ink sm:text-base">
                    {invite.nickname
                        ? c.inviteBannerNamed(invite.nickname, invite.score, invite.total)
                        : c.inviteBannerAnon(invite.score, invite.total)}
                </p>
            </div>
            <button
                aria-label="Dismiss invite banner"
                className="shrink-0 rounded-full px-2 py-1 text-xs text-muted hover:text-ink"
                onClick={() => setInvite(null)}
                type="button"
            >
                ×
            </button>
        </div>
    ) : null;

    const header = (
        <header className="flex items-start justify-between gap-3 py-3 sm:items-center sm:gap-4">
            <div className="min-w-0">
                <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 shrink-0 text-accent" />
                    <p className="truncate text-sm font-semibold text-ink">{c.appName}</p>
                </div>
                <p className="mt-1 truncate text-sm text-muted">{t(challenge.title, language)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <Button
                    aria-label="Switch language"
                    className="h-9 px-3"
                    onClick={toggleLanguage}
                    size="sm"
                    type="button"
                    variant="secondary"
                >
                    <Languages className="h-4 w-4" />
                    {languageLabel[language === "en" ? "zh" : "en"]}
                </Button>
                {phase === "playing" ? <Badge>{c.roundLabel(index + 1)}</Badge> : null}
            </div>
        </header>
    );

    if (phase === "intro" || !question) {
        return (
            <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-7 sm:py-5 lg:px-10">
                {header}
                {inviteBanner}
                <CategoryShowcase
                    activeCategory={activeCategory}
                    categories={visibleCategories}
                    language={language}
                    onSelect={selectCategory}
                    onStart={startChallenge}
                />
            </main>
        );
    }

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-7 sm:py-5 lg:px-10">
            {header}
            {inviteBanner}

            <Progress value={progress} className="mt-2" />

            <section className="flex min-h-[calc(100svh-8rem)] flex-col justify-center py-8" ref={quizRef}>
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
                    <div className="max-w-xl">
                        <div className="flex flex-wrap gap-2">
                            <Badge className="normal-case">{t(question.category, language)}</Badge>
                            <Badge className="normal-case">
                                {question.mode === "pair" ? c.pairMode : c.singleMode}
                            </Badge>
                        </div>
                        <h1 className="mt-5 text-3xl font-semibold leading-tight text-ink sm:text-5xl">
                            {question.mode === "pair" ? c.pairPrompt : c.singlePrompt}
                        </h1>
                        <p className="mt-5 text-lg leading-8 text-muted">
                            {t(question.title, language)}
                        </p>
                        <div className="mt-8 hidden border-t border-line pt-5 text-sm leading-6 text-muted lg:block">
                            {c.score} {score}
                        </div>
                        <Button
                            className="mt-5"
                            onClick={resetRun}
                            size="sm"
                            type="button"
                            variant="ghost"
                        >
                            {c.changeScene}
                        </Button>
                    </div>

                    {question.mode === "pair" ? (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <ImageChoice
                                choice={question.a}
                                label="A"
                                selected={selected === "a"}
                                revealed={revealed}
                                correct={question.aiAnswer === "a"}
                                disabled={revealed}
                                language={language}
                                onSelect={select}
                            />
                            <ImageChoice
                                choice={question.b}
                                label="B"
                                selected={selected === "b"}
                                revealed={revealed}
                                correct={question.aiAnswer === "b"}
                                disabled={revealed}
                                language={language}
                                onSelect={select}
                            />
                        </div>
                    ) : (
                        <SingleImageQuestion
                            question={question}
                            selected={selected === "ai" || selected === "real" ? selected : undefined}
                            revealed={revealed}
                            disabled={revealed}
                            language={language}
                            onSelect={select}
                        />
                    )}
                </div>

                <div className="mt-6 min-h-24 border-t border-line pt-5">
                    {revealed ? (
                        <div className="grid gap-4">
                            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                                <div>
                                    <p className="text-xl font-semibold text-ink">
                                        {selectedCorrect ? c.correct : c.fooled}
                                    </p>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                                        {c.missedPrefix}
                                        {wrongRate}
                                        {c.missedSuffix} {t(question.explanation, language)}
                                    </p>
                                </div>
                                <Button onClick={next} size="lg">
                                    {index === questions.length - 1 ? c.seeScore : c.nextImage}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="rounded-md border border-line bg-white/70 px-4 py-4 shadow-soft-line">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                                    {c.battleCardTitle}
                                </p>
                                <p className="text-xl font-semibold text-ink">
                                    {llmCorrect
                                        ? c.battleCorrect(opponentName)
                                        : c.battleWrong(opponentName)}
                                </p>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                                    {c.battleReasonLead} {llmReason}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-sm text-muted">
                            <Eye className="h-4 w-4" />
                            <span>{c.noAnswer}</span>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
