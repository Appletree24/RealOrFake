"use client";

import { HomepageBackground } from "@/components/homepage-background";
import { ImageChoice } from "@/components/image-choice";
import { ResultPanel } from "@/components/result-panel";
import { SingleImageQuestion } from "@/components/single-image-question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { ChoiceKey, DailyChallenge } from "@/data/daily";
import type { Language } from "@/lib/i18n";
import { copy, languageLabel, t } from "@/lib/i18n";
import {
    correctChoiceFor,
    isLlmCorrect,
    mockWrongRate,
    opponentNameForChallenge,
    pickQuestionBatch,
    scoreAnswers,
    scoreLlmAnswers
} from "@/lib/quiz";
import { parseInviteFromSearch, type InviteContext } from "@/lib/share-context";
import { ArrowRight, Eye, Languages, Sparkles, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type QuizAppProps = {
    challenge: DailyChallenge;
};

const DEFAULT_QUESTIONS_PER_RUN = 5;
const QUESTION_COUNT_PRESETS = [3, 5, 8, 10] as const;

function createRunSeed() {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function QuizApp({ challenge }: QuizAppProps) {
    const [language, setLanguage] = useState<Language>("en");
    const [runSeed, setRunSeed] = useState<string | null>(null);
    const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, ChoiceKey>>({});
    const [revealed, setRevealed] = useState(false);
    const [invite, setInvite] = useState<InviteContext | null>(null);
    const quizRef = useRef<HTMLElement>(null);
    const c = copy[language];
    const maxQuestionsPerRun = challenge.questions.length;
    const initialQuestionsPerRun = Math.min(DEFAULT_QUESTIONS_PER_RUN, maxQuestionsPerRun);
    const [selectedQuestionCount, setSelectedQuestionCount] = useState(initialQuestionsPerRun);
    const questionsPerRun = Math.min(Math.max(selectedQuestionCount, 1), maxQuestionsPerRun);
    const questionCountOptions = useMemo(() => {
        const options: number[] = QUESTION_COUNT_PRESETS.filter((count) => count <= maxQuestionsPerRun);
        if (maxQuestionsPerRun > 0 && !options.includes(maxQuestionsPerRun)) {
            options.push(maxQuestionsPerRun);
        }
        return options;
    }, [maxQuestionsPerRun]);
    const homepageImageSources = useMemo(
        () =>
            challenge.questions
                .flatMap((entry) =>
                    entry.mode === "pair"
                        ? [entry.a.src, entry.b.src]
                        : [entry.image.src]
                )
                .filter((src): src is string => Boolean(src)),
        [challenge.questions]
    );

    const questions = useMemo(() => {
        if (!runSeed) return [];
        return pickQuestionBatch(challenge.questions, questionsPerRun, `${challenge.day}-${runSeed}`);
    }, [challenge.day, challenge.questions, questionsPerRun, runSeed]);
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
        () => opponentNameForChallenge(challenge, runSeed ?? challenge.day),
        [challenge, runSeed]
    );
    const progress = questions.length === 0 ? 0 : ((index + (revealed ? 1 : 0)) / questions.length) * 100;

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

    function startRun(seed = createRunSeed(), count = questionsPerRun) {
        const nextCount = Math.min(Math.max(count, 1), maxQuestionsPerRun);
        if (maxQuestionsPerRun === 0) return;
        setSelectedQuestionCount(nextCount);
        setRunSeed(seed);
        setIndex(0);
        setAnswers({});
        setRevealed(false);
        setPhase("playing");
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        });
    }

    useEffect(() => {
        const parsed = parseInviteFromSearch(window.location.search);
        if (!parsed) return;
        setInvite(parsed);
        startRun(parsed.runSeed ?? createRunSeed(), parsed.total);
    }, []);

    function toggleLanguage() {
        const nextLanguage = language === "en" ? "zh" : "en";
        setLanguage(nextLanguage);
        window.localStorage.setItem("ai-photo-language", nextLanguage);
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
        startRun();
    }

    if (phase === "done") {
        return (
            <ResultPanel
                challenge={activeChallenge}
                score={score}
                llmScore={llmScore}
                opponentName={opponentName}
                runSeed={runSeed ?? undefined}
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
            <main className="relative overflow-hidden">
                <HomepageBackground imageSources={homepageImageSources} />
                <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-7 sm:py-5 lg:px-10">
                    {header}
                    {inviteBanner}
                    <section className="flex min-h-[calc(100svh-5.5rem)] items-center py-8 sm:py-10">
                        <div className="animate-quiet-rise grid w-full gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(26rem,0.85fr)] xl:items-center xl:gap-10">
                            <div className="max-w-none">
                                <Badge>{c.truthKicker}</Badge>
                                <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-ink sm:mt-6 sm:text-5xl lg:whitespace-nowrap lg:text-[3.25rem] lg:leading-[1.04] xl:text-5xl 2xl:text-6xl">
                                    {c.truthHeadline}
                                </h1>
                                <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:mt-6 sm:text-lg sm:leading-8">
                                    {c.truthBody}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Button
                                        className="w-full sm:w-auto"
                                        disabled={maxQuestionsPerRun === 0}
                                        onClick={() => startRun()}
                                        size="lg"
                                        type="button"
                                    >
                                        {c.startChallenge}
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full max-w-xl rounded-2xl border border-line bg-white/72 p-6 shadow-soft-line backdrop-blur-[10px] xl:justify-self-end">
                                <div className="flex items-center justify-between gap-3">
                                    <Badge className="normal-case">{c.mixedPool}</Badge>
                                </div>
                                <div className="mt-4 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                                            {c.questionsPerRunLabel}
                                        </p>
                                        <p className="mt-2 text-3xl font-semibold text-ink">
                                            {questionsPerRun}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {questionCountOptions.map((count) => {
                                        const active = count === questionsPerRun;
                                        const label =
                                            count === maxQuestionsPerRun ? c.allQuestions : String(count);
                                        return (
                                            <button
                                                aria-pressed={active}
                                                className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                                                    active
                                                        ? "border-ink bg-ink text-paper"
                                                        : "border-line bg-paper/70 text-ink hover:bg-white"
                                                }`}
                                                key={count}
                                                onClick={() => setSelectedQuestionCount(count)}
                                                type="button"
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="mt-3 text-xs leading-6 text-muted">{c.questionsPerRunHint}</p>
                                <p className="mt-2 text-sm leading-6 text-muted">
                                    {c.randomRunInfo(questionsPerRun)}
                                </p>
                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-md border border-line bg-paper/75 px-4 py-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                                            {c.pairMode}
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-ink">{c.pairPrompt}</p>
                                    </div>
                                    <div className="rounded-md border border-line bg-paper/75 px-4 py-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                                            {c.singleMode}
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-ink">{c.singlePrompt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
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
                            <Badge className="normal-case">{c.mixedPool}</Badge>
                            <Badge className="normal-case">
                                {question.mode === "pair" ? c.pairMode : c.singleMode}
                            </Badge>
                        </div>
                        <h1 className="mt-5 text-3xl font-semibold leading-tight text-ink md:whitespace-nowrap md:text-4xl lg:text-5xl">
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
                            onClick={() => startRun()}
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
                                        {selectedCorrect
                                            ? c.outperformedMissedSuffix
                                            : c.missedSuffix}{" "}
                                        {t(question.explanation, language)}
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
