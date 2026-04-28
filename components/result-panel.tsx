"use client";

import { Button } from "@/components/ui/button";
import type { DailyChallenge } from "@/data/daily";
import type { Language } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { percentile, resultLine } from "@/lib/quiz";
import {
    MAX_NICKNAME_LENGTH,
    buildInviteUrl,
    sanitizeNickname
} from "@/lib/share-context";
import { Check, Copy, RotateCcw, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ResultPanelProps = {
    challenge: DailyChallenge;
    score: number;
    category?: string;
    language: Language;
    onRestart: () => void;
};

const NICKNAME_STORAGE_KEY = "ai-photo-nickname";
const TOAST_DURATION_MS = 2800;

async function copyToClipboard(text: string) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // fall through to legacy path
    }

    try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        return ok;
    } catch {
        return false;
    }
}

export function ResultPanel({
    challenge,
    score,
    category,
    language,
    onRestart
}: ResultPanelProps) {
    const total = challenge.questions.length;
    const rank = percentile(score, total);
    const c = copy[language];
    const shareText = c.shareText(score, total);

    const [nicknameDialogOpen, setNicknameDialogOpen] = useState(false);
    const [nicknameDraft, setNicknameDraft] = useState("");
    const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(null);
    const toastTimer = useRef<number | null>(null);

    useEffect(() => {
        const saved = window.localStorage.getItem(NICKNAME_STORAGE_KEY);
        if (saved) setNicknameDraft(saved);
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimer.current) window.clearTimeout(toastTimer.current);
        };
    }, []);

    function showToast(kind: "success" | "error", text: string) {
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        setToast({ kind, text });
        toastTimer.current = window.setTimeout(() => {
            setToast(null);
            toastTimer.current = null;
        }, TOAST_DURATION_MS);
    }

    function openShareDialog() {
        setNicknameDialogOpen(true);
    }

    async function commitShare(rawNickname: string) {
        const nickname = sanitizeNickname(rawNickname);
        if (nickname) {
            window.localStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
        }

        const url = buildInviteUrl(window.location.origin, window.location.pathname, {
            nickname,
            score,
            total,
            day: challenge.day,
            category
        });

        setNicknameDialogOpen(false);

        const payload = `${shareText} ${url}`;
        const copied = await copyToClipboard(payload);

        if (copied) {
            showToast("success", c.linkCopied);
        } else {
            showToast("error", c.copyFailed);
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: c.appName,
                    text: shareText,
                    url
                });
            } catch {
                // user cancelled share sheet; toast already reflects clipboard status
            }
        }
    }

    return (
        <section className="relative mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-3xl flex-col justify-center px-5 py-10">
            <div className="border-y border-line py-10 text-center">
                <p className="text-sm text-muted">{challenge.day}</p>
                <h1 className="mt-4 text-6xl font-semibold leading-none text-ink sm:text-7xl">
                    {score}/{total}
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-xl leading-8 text-ink">
                    {resultLine(score, total, language)}
                </p>
                <p className="mt-4 text-sm text-muted">
                    {c.betterThan} {rank}% {c.players}
                </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button onClick={openShareDialog} size="lg">
                    <Share2 className="h-4 w-4" />
                    {c.challengeFriend}
                </Button>
                <Button onClick={onRestart} variant="secondary" size="lg">
                    <RotateCcw className="h-4 w-4" />
                    {c.replay}
                </Button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted">
                <Copy className="h-4 w-4" />
                {c.linkReady}
            </div>

            {toast ? (
                <div
                    aria-live="polite"
                    className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-4"
                    role="status"
                >
                    <div
                        className={
                            "pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-paper/95 px-4 py-2 text-sm font-medium text-ink shadow-soft-line backdrop-blur"
                        }
                    >
                        {toast.kind === "success" ? (
                            <Check className="h-4 w-4 text-accent" />
                        ) : (
                            <X className="h-4 w-4 text-red-500" />
                        )}
                        <span>{toast.text}</span>
                    </div>
                </div>
            ) : null}

            {nicknameDialogOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
                    onClick={() => setNicknameDialogOpen(false)}
                    role="presentation"
                >
                    <div
                        className="relative w-full max-w-sm rounded-md border border-line bg-paper p-6 shadow-soft-line"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button
                            aria-label="Close"
                            className="absolute right-3 top-3 rounded-full p-1 text-muted hover:text-ink"
                            onClick={() => setNicknameDialogOpen(false)}
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <h2 className="text-lg font-semibold text-ink">{c.nicknamePromptTitle}</h2>
                        <p className="mt-2 text-sm leading-6 text-muted">{c.nicknamePromptHint}</p>
                        <input
                            autoFocus
                            className="mt-4 w-full rounded-md border border-line bg-white/80 px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-ink"
                            maxLength={MAX_NICKNAME_LENGTH}
                            onChange={(event) => setNicknameDraft(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    void commitShare(nicknameDraft);
                                }
                            }}
                            placeholder={c.nicknamePlaceholder}
                            type="text"
                            value={nicknameDraft}
                        />
                        <div className="mt-5 grid grid-cols-2 gap-2">
                            <Button
                                onClick={() => {
                                    setNicknameDraft("");
                                    void commitShare("");
                                }}
                                size="lg"
                                type="button"
                                variant="secondary"
                            >
                                {c.nicknameSkip}
                            </Button>
                            <Button
                                onClick={() => void commitShare(nicknameDraft)}
                                size="lg"
                                type="button"
                            >
                                {c.nicknameContinue}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
