import type { ChoiceKey, DailyChallenge, Question } from "@/data/daily";
import type { Language } from "@/lib/i18n";

export type AnswerMap = Record<string, ChoiceKey>;

export function correctChoiceFor(question: Question): ChoiceKey {
    if (question.mode === "pair") {
        return question.aiAnswer;
    }

    return question.aiAnswer ? "ai" : "real";
}

export function isCorrect(question: Question, answer?: ChoiceKey) {
    return answer === correctChoiceFor(question);
}

export function scoreAnswers(questions: Question[], answers: AnswerMap) {
    return questions.reduce(
        (score, question) => score + (isCorrect(question, answers[question.id]) ? 1 : 0),
        0
    );
}

export function llmChoiceFor(question: Question): ChoiceKey {
    return question.llmAnswer;
}

export function isLlmCorrect(question: Question) {
    return isCorrect(question, llmChoiceFor(question));
}

export function scoreLlmAnswers(questions: Question[]) {
    return questions.reduce(
        (score, question) => score + (isLlmCorrect(question) ? 1 : 0),
        0
    );
}

export function hashSeed(seed: string) {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
        hash ^= seed.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

export function opponentNameForChallenge(
    challenge: DailyChallenge,
    category: string
) {
    const pool = challenge.opponentPool;
    if (pool.length === 0) return "Vision Model";
    const index = hashSeed(`${challenge.day}-${category}`) % pool.length;
    return pool[index];
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

export function battleResultLine(
    playerScore: number,
    llmScore: number,
    opponentName: string,
    language: Language
) {
    if (language === "zh") {
        if (playerScore > llmScore) return `你赢了 ${opponentName}。`;
        if (playerScore < llmScore) return `${opponentName} 这轮赢了你。`;
        return `你和 ${opponentName} 打平了。`;
    }

    if (playerScore > llmScore) return `You beat ${opponentName}.`;
    if (playerScore < llmScore) return `${opponentName} beat you this round.`;
    return `You tied with ${opponentName}.`;
}
