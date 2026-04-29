import { NextResponse } from "next/server";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type CaptureEmailBody = {
    email?: string;
    language?: "en" | "zh";
    score?: number;
    total?: number;
    day?: string;
    category?: string;
};

const EMAIL_FILE = path.join(process.cwd(), "data", "email-signups.jsonl");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function normalizeEmail(value: string) {
    return value.trim().toLowerCase();
}

export async function POST(request: Request) {
    const body = (await request.json()) as CaptureEmailBody;
    const email = normalizeEmail(body.email ?? "");

    if (!EMAIL_PATTERN.test(email)) {
        return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    let existing = "";
    try {
        existing = await readFile(EMAIL_FILE, "utf8");
    } catch {
        existing = "";
    }

    const duplicate = existing
        .split("\n")
        .filter(Boolean)
        .some((line) => {
            try {
                const record = JSON.parse(line) as { email?: string };
                return normalizeEmail(record.email ?? "") === email;
            } catch {
                return false;
            }
        });

    if (duplicate) {
        return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    await mkdir(path.dirname(EMAIL_FILE), { recursive: true });
    const record = {
        email,
        language: body.language ?? "en",
        score: body.score ?? null,
        total: body.total ?? null,
        day: body.day ?? null,
        category: body.category ?? null,
        createdAt: new Date().toISOString()
    };

    await appendFile(EMAIL_FILE, `${JSON.stringify(record)}\n`, "utf8");

    return NextResponse.json({ ok: true });
}
