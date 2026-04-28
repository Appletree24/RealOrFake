import type { ChoiceKey, Question } from "@/data/daily";
import type { Language } from "@/lib/i18n";

export type AnswerMap = Record<string, ChoiceKey>;

export function isCorrect(question: Question, answer?: ChoiceKey) {
    if (question.mode === "pair") {
        return answer === question.aiAnswer;
    }

    return answer === (question.aiAnswer ? "ai" : "real");
}

export function scoreAnswers(questions: Question[], answers: AnswerMap) {
    return questions.reduce(
        (score, question) => score + (isCorrect(question, answers[question.id]) ? 1 : 0),
        0
    );
}

function hashSeed(seed: string) {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
        hash ^= seed.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

export function interleaveQuestions(questions: Question[], seed: string): Question[] {
    if (questions.length <= 2) return [...questions];

    const hashed = hashSeed(seed);
    const rotatePairs = hashed % 2 === 0;
    const rotateSingles = Math.floor(hashed / 7) % 2 === 0;

    const pairs = questions.filter((q) => q.mode === "pair");
    const singles = questions.filter((q) => q.mode === "single");

    const pairOrder = rotatePairs ? [...pairs].reverse() : pairs;
    const singleOrder = rotateSingles ? [...singles].reverse() : singles;

    const leadWithPair = hashed % 3 !== 0;
    const first = leadWithPair ? pairOrder : singleOrder;
    const second = leadWithPair ? singleOrder : pairOrder;

    const merged: Question[] = [];
    const max = Math.max(first.length, second.length);
    for (let i = 0; i < max; i += 1) {
        if (i < first.length) merged.push(first[i]);
        if (i < second.length) merged.push(second[i]);
    }

    return merged;
}

export function mockWrongRate(questionId: string) {
    const seed = questionId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return 42 + (seed % 43);
}

export function percentile(score: number, total: number) {
    if (total === 0) return 0;
    const ratio = score / total;
    return Math.round(18 + ratio * 76);
}

export function resultLine(score: number, total: number, language: Language) {
    const ratio = score / total;

    if (language === "zh") {
        if (ratio >= 0.9) return "你让 AI 看起来没那么可怕。";
        if (ratio >= 0.7) return "你对合成细节仍然很敏感。";
        if (ratio >= 0.5) return "你抓住了一些破绽，但最难的几张还是生效了。";
        return "这些 AI 图确实骗过了你的眼睛。";
    }

    if (ratio >= 0.9) return "You made the model look ordinary.";
    if (ratio >= 0.7) return "You still have a good eye for synthetic detail.";
    if (ratio >= 0.5) return "You caught some tells, but the hardest images landed.";
    return "The synthetic images did their job.";
}
