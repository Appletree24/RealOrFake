export type InviteContext = {
    nickname?: string;
    score: number;
    total: number;
    day?: string;
    category?: string;
};

const MAX_NICKNAME_LENGTH = 24;
const CATEGORY_PATTERN = /^[a-z0-9-]{1,32}$/;

function sanitizeNickname(value: string | null | undefined) {
    if (!value) return undefined;
    const trimmed = value.trim().replace(/\s+/g, " ");
    if (!trimmed) return undefined;
    return trimmed.slice(0, MAX_NICKNAME_LENGTH);
}

function sanitizeCategory(value: string | null | undefined) {
    if (!value) return undefined;
    const trimmed = value.trim().toLowerCase();
    if (!CATEGORY_PATTERN.test(trimmed)) return undefined;
    return trimmed;
}

function parseIntegerParam(value: string | null, min: number, max: number) {
    if (!value) return undefined;
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return undefined;
    if (parsed < min || parsed > max) return undefined;
    return parsed;
}

export function parseInviteFromSearch(search: string): InviteContext | null {
    const params = new URLSearchParams(search);
    const score = parseIntegerParam(params.get("s"), 0, 9999);
    const total = parseIntegerParam(params.get("t"), 1, 9999);

    if (score === undefined || total === undefined) return null;
    if (score > total) return null;

    const nickname = sanitizeNickname(params.get("ref"));
    const day = params.get("d") ?? undefined;
    const category = sanitizeCategory(params.get("cat"));

    return { nickname, score, total, day, category };
}

export function buildInviteUrl(
    origin: string,
    pathname: string,
    context: InviteContext
) {
    const params = new URLSearchParams();
    if (context.nickname) {
        const clean = sanitizeNickname(context.nickname);
        if (clean) params.set("ref", clean);
    }
    params.set("s", String(context.score));
    params.set("t", String(context.total));
    if (context.day) params.set("d", context.day);
    if (context.category) {
        const clean = sanitizeCategory(context.category);
        if (clean) params.set("cat", clean);
    }

    const base = `${origin}${pathname}`;
    return `${base}?${params.toString()}`;
}

export { MAX_NICKNAME_LENGTH, sanitizeCategory, sanitizeNickname };
